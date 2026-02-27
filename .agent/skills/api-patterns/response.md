# Response Format
- Don't return inconsistent response formats
- Don't expose internal errors to clients
- Don't skip rate limiting

---

## ⚡ Project-Specific Caching Strategy (Redis)

Use Redis for high-performance reading of static Hadith data.

### Cache Key Patterns

| Resource | Pattern | Description |
|----------|---------|-------------|
| **Hadith** | `hadith:{slug}` | Single hadith content |
| **Collection** | `hadith:collection:{id}` | Full collection metadata |
| **Chapter** | `hadith:chapter:{coll}:{chap}` | Chapter-level hadiths |
| **Hadith-QA** | `hadith-qa:{id}` | Single QA pair |
| **Search** | `hadith-qa:search:{hash}` | Search results (hash of query) |

### TTL Policy

- **Hadith Content**: 24 hours
- **Collection List**: 7 days
- **Search Results**: 5 minutes

## Common Patterns

```
Choose one:
├── Envelope pattern ({ success, data, error })
├── Direct data (just return the resource)
└── HAL/JSON:API (hypermedia)
```

## Error Response

```
Include:
├── Error code (for programmatic handling)
├── User message (for display)
├── Details (for debugging, field-level errors)
├── Request ID (for support)
└── NOT internal details (security!)
```

## Pagination Types

| Type | Best For | Trade-offs |
|------|----------|------------|
| **Offset** | Simple, jumpable | Performance on large datasets |
| **Cursor** | Large datasets | Can't jump to page |
| **Keyset** | Performance critical | Requires sortable key |

### Selection Questions

1. How large is the dataset?
2. Do users need to jump to specific pages?
3. Is data frequently changing?
