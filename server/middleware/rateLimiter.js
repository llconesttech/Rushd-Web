import rateLimit from 'express-rate-limit';

// Development rate limiter - can be increased for dev
export const devRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 500, // 500 requests per minute for dev
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, slow down.' },
});

// Production rate limiter - use API key based limiting
export const rateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100, // Default per API key
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, slow down.' },
    // In production, use Redis store with API key
    // keyGenerator: (req) => req.headers['x-api-key'] || req.ip
});
