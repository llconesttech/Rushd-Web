const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

async function generateAuth() {
    const ts = Math.floor(Date.now() / 1000).toString();
    const secret = process.env.NEXT_PUBLIC_API_KEY || 'rushd-app-secret-change-this-in-production';

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(ts));
    const token = Array.from(new Uint8Array(sig))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return { token, ts };
}

const memCache = new Map();

export async function apiFetch(endpoint, options = {}) {
    const { cache: useCache = true, ttl = 300000, retries = 3 } = options;
    const url = `${API_BASE}/api/v1${endpoint}`;

    if (useCache && memCache.has(url)) {
        const cached = memCache.get(url);
        if (Date.now() - cached.ts < ttl) return cached.data;
    }

    let lastError;
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const { token, ts } = await generateAuth();

            const res = await fetch(url, {
                headers: {
                    'X-App-Token': token,
                    'X-App-Ts': ts,
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                const data = await res.json();
                if (useCache) memCache.set(url, { data, ts: Date.now() });
                return data;
            }

            // Retry on rate-limit (429) or server errors (5xx)
            if (res.status === 429 || res.status >= 500) {
                lastError = new Error(`API Error: ${res.status} ${endpoint}`);
                if (attempt < retries - 1) {
                    await new Promise(r => setTimeout(r, 300 * Math.pow(2, attempt)));
                    continue;
                }
            }

            throw new Error(`API Error: ${res.status} ${endpoint}`);
        } catch (err) {
            lastError = err;
            // Retry on network errors (aborted fetches, connection refused)
            const isNetworkError = err.name === 'TypeError' || err.name === 'AbortError';
            if (isNetworkError && attempt < retries - 1) {
                await new Promise(r => setTimeout(r, 300 * Math.pow(2, attempt)));
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
