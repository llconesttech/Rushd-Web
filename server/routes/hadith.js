import { Router } from 'express';
import { cacheMiddleware } from '../middleware/cache.js';
import * as hadithData from '../services/hadithDataService.js';

const router = Router();

// GET /api/v1/hadith/editions
router.get('/editions', cacheMiddleware(), async (req, res, next) => {
    try {
        res.json(await hadithData.getEditions());
    } catch (err) { next(err); }
});

// GET /api/v1/hadith/info
router.get('/info', cacheMiddleware(), async (req, res, next) => {
    try {
        res.json(await hadithData.getInfo());
    } catch (err) { next(err); }
});

// GET /api/v1/hadith/narrators
router.get('/narrators', cacheMiddleware(), async (req, res, next) => {
    try {
        res.json(await hadithData.getNarratorMaster());
    } catch (err) { next(err); }
});

// GET /api/v1/hadith/narrator-clusters
router.get('/narrator-clusters', cacheMiddleware(), async (req, res, next) => {
    try {
        res.json(await hadithData.getNarratorClusters());
    } catch (err) { next(err); }
});

// GET /api/v1/hadith/:bookId/:lang (e.g., /bukhari/eng)
router.get('/:bookId/:lang', cacheMiddleware(), async (req, res, next) => {
    try {
        const { bookId, lang } = req.params;
        res.json(await hadithData.getEdition(bookId, lang));
    } catch (err) { next(err); }
});

export default router;
