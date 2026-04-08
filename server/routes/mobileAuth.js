import { Router } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const router = Router();

const API_SECRET = process.env.API_SECRET || 'rushd-app-secret-change-this-in-production';
const MOBILE_API_KEYS = (process.env.MOBILE_API_KEYS || '').split(',').filter(Boolean);
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const JWT_EXPIRY = process.env.MOBILE_JWT_EXPIRY || '1h';

const TOKEN_WINDOW = 60;

function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim()
        || req.headers['cf-connecting-ip']
        || req.headers['x-real-ip']
        || req.connection?.remoteAddress
        || 'unknown';
}

router.post('/auth', async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];
        const token = req.headers['x-app-token'];
        const timestamp = req.headers['x-app-ts'];

        if (!apiKey || !MOBILE_API_KEYS.includes(apiKey)) {
            return res.status(403).json({ error: 'Invalid API key' });
        }

        if (!token || !timestamp) {
            return res.status(403).json({ error: 'Missing authentication token' });
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

        const jwtToken = jwt.sign(
            {
                type: 'mobile',
                apiKey: apiKey,
                ip: getClientIP(req),
                issuedAt: now,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        res.json({
            token: jwtToken,
            expiresIn: JWT_EXPIRY === '1h' ? 3600 : parseInt(JWT_EXPIRY),
            type: 'Bearer',
        });
    } catch (err) {
        next(err);
    }
});

router.post('/auth/refresh', async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid token' });
        }

        const token = authHeader.substring(7);
        
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            const newToken = jwt.sign(
                {
                    type: 'mobile',
                    apiKey: decoded.apiKey,
                    ip: getClientIP(req),
                    issuedAt: Math.floor(Date.now() / 1000),
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRY }
            );

            res.json({
                token: newToken,
                expiresIn: JWT_EXPIRY === '1h' ? 3600 : parseInt(JWT_EXPIRY),
            });
        } catch (jwtErr) {
            return res.status(401).json({ error: 'Token expired or invalid' });
        }
    } catch (err) {
        next(err);
    }
});

export default router;