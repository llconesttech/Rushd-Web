# DB Architecture: Hadith & Hadith-QA (PostgreSQL)

This document outlines the database architecture for Hadith collections and Hadith-QA content.

---

## Architecture Guidelines

> [!IMPORTANT]
> 1. **Single Source of Truth**: The `schema.prisma` file is the master definition.
> 2. **Types over Comments**: Avoid manual docs; rely on Prisma's auto-generated types.
> 3. **Migration Integrity**: Never modify SQL migrations manually. Use `prisma migrate dev`.
> 4. **Read Optimization First**: Design for reads; writes happen via seeding only.

---

## Data Structure

### Hadith
- **Collections**: Bukhari, Muslim, Tirmidhi, etc. (~9 major collections)
- **Languages**: English, Arabic, Urdu, Bengali, and more
- **Structure**: Collection → Chapter → Hadith

### Hadith-QA
- **Content**: Q&A pairs derived from hadiths
- **Search**: By Arabic/English text, collection, chapter, hadith number
- **Categories**: Topics/tags for navigation

---

## Proposed Schema Design

### 1. Hadith Collection

```prisma
model HadithCollection {
  id          String   @id // e.g., "bukhari", "muslim", "tirmidhi"
  name        String   // e.g., "Sahih al-Bukhari"
  nameAr      String?  // Arabic name
  description String?
  totalChapters Int?
  totalHadiths Int?
  
  chapters    HadithChapter[]
  hadiths     Hadith[]
  
  @@index([id])
}
```

### 2. Hadith Chapter

```prisma
model HadithChapter {
  id              String   @id @default(cuid())
  collectionId    String
  chapterNumber   Int
  
  title           String   @db.Text
  titleAr         String?  @db.Text
  
  // Range
  hadithStart     Int?
  hadithEnd       Int?
  
  collection      HadithCollection @relation(fields: [collectionId], references: [id])
  hadiths         Hadith[]
  
  @@unique([collectionId, chapterNumber])
  @@index([collectionId])
}
```

### 3. Hadith
Core hadith content - stores text in multiple languages.

```prisma
model Hadith {
  id                String     @id @default(cuid())
  collectionId      String
  chapterId         String?
  
  // Identification
  hadithNumber      String     // String for "12a", "345b" etc.
  slug              String     @unique // e.g., "bukhari-1-1"
  
  // Multi-language content
  textEn            String    @db.Text // English (primary)
  textAr            String?   @db.Text // Arabic
  textUr            String?   @db.Text // Urdu
  textBn            String?   @db.Text // Bengali
  
  // Metadata
  grade             String?
  gradeAr           String?
  
  // Reference
  reference         Json?     // { book: 1, hadith: 1 }
  sourceJson        String?   // Original file reference
  
  // Relations
  collection        HadithCollection @relation(fields: [collectionId], references: [id])
  chapter           HadithChapter?   @relation(fields: [chapterId], references: [id])
  bookmarks         Bookmark[]
  history           History[]
  
  @@index([collectionId, hadithNumber])
  @@index([slug])
  @@index([collectionId])
}
```

### 4. Hadith-QA
Questions and answers from hadith content.

```prisma
model HadithQA {
  id              String   @id @default(cuid())
  
  // Content
  question        String   @db.Text
  answer          String   @db.Text
  questionAr      String?  @db.Text
  answerAr        String?  @db.Text
  
  // Reference
  hadithRef       String?  // e.g., "bukhari-1-1"
  collectionId    String?
  
  // Organization
  category        String?
  tags            String[] // ["faith", "worship", "etc"]
  
  // Search optimization
  searchTerms     String?  @db.Text // Pre-computed searchable terms
  
  @@index([category])
  @@index([collectionId])
}
```

### 5. User & Auth

```prisma
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  hashedPassword  String
  name            String?
  role            UserRole  @default(USER)
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  preferences     Json      @default("{}")
  
  bookmarks       Bookmark[]
  history         History[]
  
  @@index([email])
}

enum UserRole {
  USER
  ADMIN
}
```

### 6. Bookmarks & History

```prisma
model Bookmark {
  id        String   @id @default(cuid())
  userId    String
  hadithId  String
  note      String?
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  hadith    Hadith   @relation(fields: [hadithId], references: [id], onDelete: Cascade)

  @@unique([userId, hadithId])
  @@index([userId])
}

model History {
  id        String   @id @default(cuid())
  userId    String
  hadithId  String
  lastRead  DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  hadith    Hadith   @relation(fields: [hadithId], references: [id], onDelete: Cascade)

  @@unique([userId, hadithId])
  @@index([userId, lastRead])
}
```

---

## Performance Optimizations

### 1. Connection Pooling

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=50&pool_timeout=10"
```

### 2. Indexing Strategy

| Table          | Index Type        | Columns                  | Purpose              |
|----------------|-------------------|--------------------------|----------------------|
| Hadith         | Unique            | collectionId, hadithNumber | Compound key      |
| Hadith         | Hash              | slug                     | Deep-link lookups   |
| Hadith         | B-tree            | collectionId             | Collection fetch    |
| HadithChapter  | Unique            | collectionId, chapterNumber | Compound key      |
| HadithQA       | B-tree            | category                 | Category filter     |
| HadithQA       | GIN               | tags                     | Tag search          |
| Bookmark       | B-tree            | userId                   | User bookmarks      |
| History        | B-tree            | userId, lastRead         | Recent history      |

### 3. Caching Strategy (Redis)

**Cache Keys:**
```
# Hadith
hadith:{slug}                    // Single hadith
hadith:collection:{id}           // Full collection
hadith:chapter:{collection}:{chapter} // Chapter hadiths

# Hadith-QA
hadith-qa:{id}                   // Single QA
hadith-qa:category:{category}   // QA by category
hadith-qa:search:{hash}         // Search results (hash of query)
hadith-qa:tags:{tag}             // QA by tag
```

**Cache TTL:**
- Hadith content: 24 hours
- Collection list: 7 days
- Search results: 5 minutes

---

## API Examples

### Get Hadith by Slug
```typescript
const hadith = await prisma.hadith.findUnique({
  where: { slug: 'bukhari-1-1' },
  include: { collection: true }
});
```

### Get Chapter's Hadiths
```typescript
const hadiths = await prisma.hadith.findMany({
  where: { chapterId: chapterId },
  orderBy: { hadithNumber: 'asc' }
});
```

### Search Hadith-QA
```typescript
const results = await prisma.hadithQA.findMany({
  where: {
    OR: [
      { question: { contains: query, mode: 'insensitive' } },
      { answer: { contains: query, mode: 'insensitive' } },
      { tags: { has: query } }
    ]
  },
  take: 20
});
```

---

## Seeding Strategy

### Phase 1: Seed Collections
Import all hadith collections (Bukhari, Muslim, etc.)

### Phase 2: Seed Chapters
Import chapters for each collection

### Phase 3: Seed Hadiths
Import all hadiths with multi-language text

### Phase 4: Seed Hadith-QA
Import Q&A content with tags

---

## Implementation Workflow

### Phase 1: Setup
- [ ] Install: `npm install prisma @prisma/client ioredis`
- [ ] Initialize: `npx prisma init`
- [ ] Configure `.env`

### Phase 2: Schema & Migration
1. Define models in `prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name init_hadith`

### Phase 3: Redis
- [ ] Set up Redis
- [ ] Create cache service

### Phase 4: Seeding
- [ ] Create seed scripts
- [ ] Import data

---

## Data Volume Estimates

| Data Type         | Count (Est.) |
|-------------------|--------------|
| Collections       | 9-15         |
| Chapters          | ~3,000       |
| Hadiths           | ~50,000      |
| Hadith-QA         | ~5,000       |
| Users (bookmarks) | Millions     |

---

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/db"
REDIS_URL="redis://user:password@host:6379"
```

---

## Summary

| Feature | Implementation |
|---------|----------------|
| **Database** | PostgreSQL + Prisma |
| **Caching** | Redis |
| **Hadith** | Multi-language (En, Ar, Ur, Bn) |
| **Hadith-QA** | Full-text search + tags |
| **User Data** | Bookmarks, History |
| **Scaling** | Connection pooling + read replicas ready |
