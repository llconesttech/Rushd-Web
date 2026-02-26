import { Router } from 'express';
import { cacheMiddleware } from '../middleware/cache.js';
import * as qaData from '../services/qaDataService.js';

const router = Router();

// GET /api/v1/qa/macro-index
router.get('/macro-index', cacheMiddleware(), async (req, res, next) => {
    try {
        res.json(await qaData.getMacroIndex());
    } catch (err) { next(err); }
});

// GET /api/v1/qa/search-index
router.get('/search-index', cacheMiddleware(), async (req, res, next) => {
    try {
        res.json(await qaData.getSearchIndex());
    } catch (err) { next(err); }
});

// GET /api/v1/qa/topics
router.get('/topics', cacheMiddleware(), async (req, res, next) => {
    try {
        res.json(await qaData.getTopics());
    } catch (err) { next(err); }
});

// GET /api/v1/qa/:book/:chapter
router.get('/:book/:chapter', cacheMiddleware(), async (req, res, next) => {
    try {
        res.json(await qaData.getChapter(req.params.book, req.params.chapter));
    } catch (err) { next(err); }
});

export default router;
