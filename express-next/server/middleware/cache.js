const memCache = new Map();
const DEFAULT_TTL = 5 * 60 * 1000;

export function cacheMiddleware(ttlMs = DEFAULT_TTL) {
    return (req, res, next) => {
        const key = req.originalUrl;
        const cached = memCache.get(key);

        if (cached && Date.now() - cached.timestamp < ttlMs) {
            return res.json(cached.data);
        }

        const originalJson = res.json.bind(res);
        res.json = (data) => {
            memCache.set(key, { data, timestamp: Date.now() });
            return originalJson(data);
        };

        next();
    };
}

export function clearCache() {
    memCache.clear();
}
