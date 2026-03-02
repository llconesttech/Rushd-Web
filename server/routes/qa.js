import { Router } from 'express';
import { cacheMiddleware } from '../middleware/cache.js';
import * as qaData from '../services/qaDataService.js';

const router = Router();

// GET /api/v1/qa/macro-index - Overview of all books and chapters
router.get('/macro-index', cacheMiddleware(), async (req, res, next) => {
    try {
        res.json(await qaData.getMacroIndex());
    } catch (err) { next(err); }
});

// GET /api/v1/qa/search-index - Full search index
router.get('/search-index', cacheMiddleware(), async (req, res, next) => {
    try {
        res.json(await qaData.getSearchIndex());
    } catch (err) { next(err); }
});

// GET /api/v1/qa/topics - Raw topics structure
router.get('/topics', cacheMiddleware(), async (req, res, next) => {
    try {
        res.json(await qaData.getTopics());
    } catch (err) { next(err); }
});

// GET /api/v1/qa/categories - Categories with subcategories (for navigation)
router.get('/categories', cacheMiddleware(), async (req, res, next) => {
    try {
        res.json(await qaData.getCategories());
    } catch (err) { next(err); }
});

// GET /api/v1/qa/category/:category - Get subcategories for a category
router.get('/category/:category', cacheMiddleware(), async (req, res, next) => {
    try {
        const { category } = req.params;
        const decoded = decodeURIComponent(category);
        const result = await qaData.getSubcategories(decoded);
        if (!result) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(result);
    } catch (err) { next(err); }
});

// GET /api/v1/qa/subcategory/:category/:subcategory - Get Q&A for subcategory
router.get('/subcategory/:category/:subcategory', cacheMiddleware(), async (req, res, next) => {
    try {
        const { category, subcategory } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        
        const result = await qaData.getQABySubcategory(
            decodeURIComponent(category),
            decodeURIComponent(subcategory),
            { page, limit }
        );
        
        if (!result) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }
        res.json(result);
    } catch (err) { next(err); }
});

// GET /api/v1/qa/item/:id - Get single Q&A item
router.get('/item/:id', cacheMiddleware(), async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await qaData.getQAItem(id);
        if (!result) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(result);
    } catch (err) { next(err); }
});

// GET /api/v1/qa/search - Server-side search with pagination
router.get('/search', cacheMiddleware(), async (req, res, next) => {
    try {
        const { q, page, limit } = req.query;
        const pageNum = parseInt(page) || 1;
        const limitNum = Math.min(parseInt(limit) || 20, 100);
        
        if (!q || q.trim().length < 2) {
            return res.status(400).json({ error: 'Search query must be at least 2 characters' });
        }
        
        const result = await qaData.searchQA(q, { page: pageNum, limit: limitNum });
        res.json(result);
    } catch (err) { next(err); }
});

// GET /api/v1/qa/:book/:chapter - Get chapter (existing)
router.get('/:book/:chapter', cacheMiddleware(), async (req, res, next) => {
    try {
        res.json(await qaData.getChapter(req.params.book, req.params.chapter));
    } catch (err) { next(err); }
});

export default router;
