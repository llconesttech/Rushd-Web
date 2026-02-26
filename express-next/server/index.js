import 'dotenv/config';
import express from 'express';
import next from 'next';
import helmet from 'helmet';
import cors from 'cors';
import { authMiddleware } from './middleware/auth.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { securityHeaders } from './middleware/security.js';
import quranRoutes from './routes/quran.js';
import hadithRoutes from './routes/hadith.js';
import qaRoutes from './routes/qa.js';
import audioRoutes from './routes/audio.js';
import assetsRoutes from './routes/assets.js';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
    const server = express();

    // Global middleware
    server.use(helmet({
        contentSecurityPolicy: false, // Let Next.js handle CSP
    }));
    server.use(cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    }));
    server.use(express.json());

    // API routes — protected (shared by web + mobile)
    server.use('/api/v1/quran', rateLimiter, authMiddleware, securityHeaders, quranRoutes);
    server.use('/api/v1/hadith', rateLimiter, authMiddleware, securityHeaders, hadithRoutes);
    server.use('/api/v1/qa', rateLimiter, authMiddleware, securityHeaders, qaRoutes);
    server.use('/api/v1/audio', rateLimiter, authMiddleware, audioRoutes);
    server.use('/api/v1/assets', rateLimiter, authMiddleware, assetsRoutes);

    // Global error handler
    server.use((err, req, res, _next) => {
        const status = err.code === 'ENOENT' ? 404 : 500;
        const message = status === 404 ? 'Resource not found' : 'Internal server error';
        console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err.message);
        res.status(status).json({ error: message });
    });

    // All other routes → Next.js
    server.all('/{*path}', (req, res) => handle(req, res));

    server.listen(PORT, () => {
        console.log(`> Rushd App ready on http://localhost:${PORT}`);
        console.log(`> API: http://localhost:${PORT}/api/v1`);
        console.log(`> Environment: ${dev ? 'development' : 'production'}`);
    });
});
