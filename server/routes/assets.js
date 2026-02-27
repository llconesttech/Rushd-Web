import { Router } from 'express';
import path from 'path';
import express from 'express';

const router = Router();
const ASSETS_DIR = path.join(process.cwd(), 'server', 'data', 'assets');

router.use('/', express.static(ASSETS_DIR, {
    maxAge: '7d',
    setHeaders: (res) => {
        res.setHeader('X-Robots-Tag', 'noindex');
    },
}));

export default router;
