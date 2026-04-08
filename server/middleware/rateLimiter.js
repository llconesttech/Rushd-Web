import rateLimit from 'express-rate-limit';

function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim()
        || req.headers['cf-connecting-ip']
        || req.headers['x-real-ip']
        || req.connection?.remoteAddress
        || 'unknown';
}

export const devRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, slow down.' },
    keyGenerator: (req) => getClientIP(req),
});

export const rateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, slow down.' },
    keyGenerator: (req) => getClientIP(req),
});
