import crypto from 'crypto';

const API_SECRET = process.env.API_SECRET || 'rushd-app-secret-change-this-in-production';
const MOBILE_API_KEYS = (process.env.MOBILE_API_KEYS || '').split(',').filter(Boolean);
const TOKEN_WINDOW = 60;

function isPrivateDevRequest(req) {
    const ip = String(req.ip || '');
    // Express may represent IPv4 as "::ffff:192.168.x.x"
    const v4 = ip.startsWith('::ffff:') ? ip.slice('::ffff:'.length) : ip;
    if (v4 === '127.0.0.1' || v4 === '::1') return true;
    if (v4.startsWith('192.168.')) return true;
    if (v4.startsWith('10.')) return true;
    // 172.16.0.0 – 172.31.255.255
    const m = v4.match(/^172\.(\d+)\./);
    if (m) {
        const second = Number(m[1]);
        if (second >= 16 && second <= 31) return true;
    }
    return false;
}

export function authMiddleware(req, res, next) {
    const dev = process.env.NODE_ENV !== 'production';
    // In LAN dev over plain HTTP, some browsers do not provide WebCrypto (`crypto.subtle`),
    // which prevents the frontend from generating HMAC headers. Allow private-network dev
    // requests without auth, but keep auth in production.
    if (dev && isPrivateDevRequest(req)) {
        req.clientType = 'dev';
        return next();
    }

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
