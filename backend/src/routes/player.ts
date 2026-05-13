import { Router } from 'express';
import youtubedl from 'youtube-dl-exec';
import { getTrackInfo } from '../services/extractor'; // Import the service

const router = Router();

// NEW: The endpoint to fetch song metadata
router.get('/info', async (req, res) => {
    const url = req.query.url as string;
    if (!url) return res.status(400).send('No URL provided');

    try {
        const info = await getTrackInfo(url);
        res.json(info); // Sends the title and thumbnail back to Vue
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to extract track info' });
    }
});

router.get('/stream', (req, res) => {
    const url = req.query.url as string;
    
    if (!url) return res.status(400).send('No URL provided');

    // Set headers for audio streaming
    res.setHeader('Content-Type', 'audio/webm');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Spawn yt-dlp and pipe the raw audio output directly to the response
    const audioStream = youtubedl.exec(url, {
        output: '-', // Output to stdout
        format: 'bestaudio',
        limitRate: '1M',
    });

    audioStream.stdout?.pipe(res);

    // Handle cleanup if the user skips the song or closes the browser
    req.on('close', () => {
        audioStream.kill();
    });
});

export default router;