import { Router } from 'express';
import { cacheMiddleware } from '../middleware/cache.js';
import { NINETY_NINE_NAMES } from '../../data/asmaulHusnaData.js';

const router = Router();

// GET /api/v1/asmaul-husna - All 99 Names
router.get('/', cacheMiddleware(), (req, res) => {
    res.json(NINETY_NINE_NAMES);
});

// GET /api/v1/asmaul-husna/:id - Single Name by ID
router.get('/:id', cacheMiddleware(), (req, res) => {
    const id = parseInt(req.params.id, 10);
    const name = NINETY_NINE_NAMES.find(n => n.id === id);
    
    if (!name) {
        return res.status(404).json({ error: 'Name not found' });
    }
    
    res.json(name);
});

export default router;
