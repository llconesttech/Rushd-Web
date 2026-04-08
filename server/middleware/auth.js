import crypto from 'crypto';

const API_SECRET = process.env.API_SECRET || 'rushd-app-secret-change-this-in-production';
const MOBILE_API_KEYS = (process.env.MOBILE_API_KEYS || '').split(',').filter(Boolean);
const TOKEN_WINDOW = 60;

const INTERNAL_IPS = [
    '127.0.0.1',
    '::1',
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.0.0/16',
];

function isInternalIP(ip) {
    if (!ip) return false;
    if (ip === '127.0.0.1' || ip === '::1') return true;
    
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    
    const num = (parseInt(parts[0]) << 24) + (parseInt(parts[1]) << 16) + (parseInt(parts[2]) << 8) + parseInt(parts[3]);
    
    const ranges = [
        { start: 0x0A000000, end: 0x0AFFFFFF },
        { start: 0xAC100000, end: 0xAC1FFFFF },
        { start: 0xC0A80000, end: 0xC0A8FFFF },
    ];
    
    return ranges.some(r => num >= r.start && num <= r.end);
}

function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim()
        || req.headers['cf-connecting-ip']
        || req.headers['x-real-ip']
        || req.connection?.remoteAddress
        || 'unknown';
}

export function authMiddleware(req, res, next) {
    const clientIP = getClientIP(req);
    
    const apiKey = req.headers['x-api-key'];
    if (apiKey && MOBILE_API_KEYS.includes(apiKey)) {
        req.clientType = 'mobile';
        req.clientIP = clientIP;
        return next();
    }

    const token = req.headers['x-app-token'];
    const timestamp = req.headers['x-app-ts'];

    if (!token || !timestamp) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const now = Math.floor(Date.now() / 1000);
    const ts = parseInt(timestamp, 10);
    if (Math.abs(now - ts) > TOKEN_WINDOW) {
        return res.status(403).json({ error: 'Token expired' });
    }

    const expected = crypto
        .createHmac('sha256', API_SECRET)
        .update(`${ts}`)
        .digest('hex');

    if (token !== expected) {
        return res.status(403).json({ error: 'Invalid token' });
    }

    req.clientType = 'web';
    req.clientIP = clientIP;
    next();
}

export function validateRequestOrigin(req, res, next) {
    const clientIP = getClientIP(req);
    
    if (process.env.NODE_ENV === 'production') {
        const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
        
        if (allowedOrigins.length > 0 && !allowedOrigins.includes('*')) {
            const origin = req.headers.origin;
            if (origin && !allowedOrigins.includes(origin)) {
                console.warn(`[Security] Blocked request from origin: ${origin}, IP: ${clientIP}`);
                return res.status(403).json({ error: 'Origin not allowed' });
            }
        }
    }
    
    next();
}
