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
    const { cache: useCache = true, ttl = 300000 } = options;
    const url = `${API_BASE}/api/v1${endpoint}`;

    if (useCache && memCache.has(url)) {
        const cached = memCache.get(url);
        if (Date.now() - cached.ts < ttl) return cached.data;
    }

    const { token, ts } = await generateAuth();

    const res = await fetch(url, {
        headers: {
            'X-App-Token': token,
            'X-App-Ts': ts,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${endpoint}`);
    }

    const data = await res.json();
    if (useCache) memCache.set(url, { data, ts: Date.now() });
    return data;
}

export function clearApiCache() {
    memCache.clear();
}
