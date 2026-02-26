import crypto from 'crypto';

const API_SECRET = process.env.API_SECRET || 'rushd-app-secret-2026';
const MOBILE_API_KEYS = (process.env.MOBILE_API_KEYS || '').split(',').filter(Boolean);
const TOKEN_WINDOW = 60;

export function authMiddleware(req, res, next) {
    // Mode 1: Mobile API Key (Flutter)
    const apiKey = req.headers['x-api-key'];
    if (apiKey && MOBILE_API_KEYS.includes(apiKey)) {
        req.clientType = 'mobile';
        return next();
    }

    // Mode 2: Web HMAC Token (Next.js)
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
    next();
}
