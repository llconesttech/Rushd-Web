const fs = require('fs');
const path = require('path');

const QA_TOPICS_PATH = path.join(__dirname, 'public/data/hadith-qa/qa_topics.json');
const NEW_INDEX_PATH = path.join(__dirname, 'public/data/hadith-qa/qa_macro_index.json');

// Define Macro Categories and keywords to match traditional Book names
const CATEGORY_MAP = [
  {
    category: "Faith & Belief",
    keywords: ["belief", "faith", "revelation", "tawheed", "oneness", "forgiveness", "repentance", "heart", "qadar", "divine will", "destiny"]
  },
  {
    category: "Prayer & Worship",
    keywords: ["prayer", "salat", "mosque", "masjid", "wudu", "ablution", "ghusl", "tahajjud", "witr", "eid", "tayammum", "funeral", "janaa'iz", "adhaan", "call to prayer"]
  },
  {
    category: "Fasting & Ramadan",
    keywords: ["fasting", "ramadan", "tarawih", "i'tikaf", "lailat-ul-qadr"]
  },
  {
    category: "Charity & Wealth",
    keywords: ["zakat", "charity", "sadaqah", "gift", "endowment", "waqf"]
  },
  {
    category: "Hajj & Umrah",
    keywords: ["hajj", "pilgrimage", "umrah", "muharram", "medina", "makkah"]
  },
  {
    category: "Trade & Business",
    keywords: ["trade", "sale", "business", "loan", "debt", "agriculture", "farmer", "rent", "employment", "wage", "bankruptcy", "property", "wealth"]
  },
  {
    category: "Family & Marriage",
    keywords: ["marriage", "wedlock", "nikaah", "divorce", "family", "children", "orphan", "suckling", "breastfeeding", "maintenance", "birth"]
  },
  {
    category: "Food, Drink & Clothing",
    keywords: ["food", "meal", "drink", "water", "clothing", "dress", "hunting", "slaughter", "sacrifice", "guest"]
  },
  {
    category: "Society & Ethics",
    keywords: ["manner", "adab", "ethics", "oath", "vow", "greeting", "permission", "guest", "neighbor", "peace", "blood money", "punishment", "hudood", "crime", "oppressor", "oppression"]
  },
  {
    category: "Knowledge & Seeking",
    keywords: ["knowledge", "science", "ilm", "quran", "recitation", "tafsir", "virtue", "excellence"]
  },
  {
    category: "Prophets & History",
    keywords: ["prophet", "messenger", "companion", "history", "creation", "jihad", "expedition", "military"]
  },
  {
    category: "Hereafter & Judgment",
    keywords: ["hereafter", "judgment", "paradise", "hell", "resurrection", "dream", "vision", "affliction", "trial", "fitna", "sign"]
  },
  {
    category: "Medicine & Health",
    keywords: ["medicine", "health", "sickness", "healing", "disease", "patient"]
  }
];

function determineCategory(bookName) {
  const norm = bookName.toLowerCase();
  for (const map of CATEGORY_MAP) {
    for (const kw of map.keywords) {
      if (norm.includes(kw)) {
        return map.category;
      }
    }
  }
  return "Miscellaneous & Others";
}

async function buildIndex() {
  const rawTopics = JSON.parse(fs.readFileSync(QA_TOPICS_PATH, 'utf-8'));
  const categoryMap = new Map();

  for (const topic of rawTopics) {
    let catName = determineCategory(topic.name);

    // Fallback for Ahmad where names are just "Book X"
    if (topic.name.toLowerCase().startsWith("book")) {
      catName = "Miscellaneous & Others";
    }

    if (!categoryMap.has(catName)) {
      categoryMap.set(catName, {
        name: catName,
        total: 0,
        refs: {}
      });
    }

    const catObj = categoryMap.get(catName);
    catObj.total += topic.total;

    // Merge refs
    for (const [bookId, chapters] of Object.entries(topic.refs)) {
      if (!catObj.refs[bookId]) catObj.refs[bookId] = {};
      for (const [chId, count] of Object.entries(chapters)) {
        if (!catObj.refs[bookId][chId]) catObj.refs[bookId][chId] = 0;
        catObj.refs[bookId][chId] += count; // keep track of questions per chapter
      }
    }
  }

  // Convert to array and sort by total
  const finalArray = Array.from(categoryMap.values()).sort((a, b) => b.total - a.total);

  fs.writeFileSync(NEW_INDEX_PATH, JSON.stringify(finalArray, null, 2));
  console.log(`Generated Macro Index with ${finalArray.length} Categories.`);
}

buildIndex();
