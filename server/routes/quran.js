import { Router } from 'express';
import { cacheMiddleware } from '../middleware/cache.js';
import * as quranData from '../services/quranDataService.js';

const router = Router();

// GET /api/v1/quran/meta
router.get('/meta', cacheMiddleware(), async (req, res, next) => {
    try {
        res.json(await quranData.getMeta());
    } catch (err) { next(err); }
});

// GET /api/v1/quran/surah/:number?edition=quran-uthmani&type=arabic
router.get('/surah/:number', cacheMiddleware(), async (req, res, next) => {
    try {
        const { number } = req.params;
        const { edition = 'quran-uthmani', type = 'arabic' } = req.query;
        res.json(await quranData.getSurah(number, edition, type));
    } catch (err) { next(err); }
});

// GET /api/v1/quran/page/:script/:page
router.get('/page/:script/:page', cacheMiddleware(), async (req, res, next) => {
    try {
        res.json(await quranData.getPage(req.params.script, req.params.page));
    } catch (err) { next(err); }
});

// GET /api/v1/quran/tafsir-meta
router.get('/tafsir-meta', cacheMiddleware(), async (req, res, next) => {
    try {
        res.json(await quranData.getTafsirMeta());
    } catch (err) { next(err); }
});

// GET /api/v1/quran/shan-e-nuzool/:edition/:surah
router.get('/shan-e-nuzool/:edition/:surah', cacheMiddleware(), async (req, res, next) => {
    try {
        res.json(await quranData.getShanENuzool(req.params.edition, req.params.surah));
    } catch (err) { next(err); }
});

// GET /api/v1/quran/search?q=...&edition=en-sahih&limit=50
router.get('/search', async (req, res, next) => {
    try {
        const { q, edition = 'en-sahih', limit = 50 } = req.query;
        if (!q || !q.trim()) return res.json([]);
        res.json(await quranData.search(q, edition, parseInt(limit)));
    } catch (err) { next(err); }
});

export default router;
