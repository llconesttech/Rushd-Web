import { Router } from 'express';
import { createReadStream, statSync } from 'fs';
import path from 'path';

const router = Router();
const AUDIO_DIR = path.join(process.cwd(), 'server', 'data', 'audio');

// GET /api/v1/audio/:reciter/:filename
router.get('/:reciter/:filename', (req, res) => {
    const { reciter, filename } = req.params;

    // Sanitize path segments to prevent directory traversal
    if (reciter.includes('..') || filename.includes('..')) {
        return res.status(400).json({ error: 'Invalid path' });
    }

    const filePath = path.join(AUDIO_DIR, reciter, filename);

    try {
        const stat = statSync(filePath);
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;

            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${stat.size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': end - start + 1,
                'Content-Type': 'audio/mpeg',
            });
            createReadStream(filePath, { start, end }).pipe(res);
        } else {
            res.writeHead(200, {
                'Content-Length': stat.size,
                'Content-Type': 'audio/mpeg',
                'Accept-Ranges': 'bytes',
            });
            createReadStream(filePath).pipe(res);
        }
    } catch {
        res.status(404).json({ error: 'Audio not found' });
    }
});

export default router;
