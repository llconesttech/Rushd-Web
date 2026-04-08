const memCache = new Map();

export async function apiFetch(endpoint, options = {}) {
  const { cache: useCache = true, ttl = 300000, retries = 3 } = options;
  
  const url = `/api/proxy${endpoint}`;

  if (useCache && memCache.has(url)) {
    const cached = memCache.get(url);
    if (Date.now() - cached.ts < ttl) return cached.data;
  }

  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = { error: `Request failed with status ${res.status}` };
        }
        lastError = new Error(errorData.error || `API Error: ${res.status}`);
        
        if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          throw lastError;
        }
        
        if (attempt < retries - 1) {
          await new Promise((r) => setTimeout(r, 300 * Math.pow(2, attempt)));
          continue;
        }
        throw lastError;
      }

      const data = await res.json();
      if (useCache) memCache.set(url, { data, ts: Date.now() });
      return data;
    } catch (err) {
      lastError = err;
      const isNetworkError = err.name === "TypeError" || err.name === "AbortError";
      if (isNetworkError && attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, 300 * Math.pow(2, attempt)));
        continue;
      }
      if (!isNetworkError) throw err;
    }
  }
  throw lastError;
}

export function clearApiCache() {
  memCache.clear();
}
