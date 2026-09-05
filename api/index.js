const express = require('express');
const cors = require('cors');
const { Tiktok } = require('@tobyg74/tiktok-api-dl');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Backend TikTok Downloader Aktif!' });
});

app.post('/api/process-media', async (req, res) => {
    const { fileUrl } = req.body;

    if (!fileUrl) {
        return res.status(400).json({ error: 'URL tidak ditemukan' });
    }

    try {
        const result = await Tiktok(fileUrl, { version: 'v1' });

        if (result.status === 'success' && result.result) {
            const videoData = result.result;
            // Ambil URL video tanpa watermark
            const downloadUrl = videoData.video1 || videoData.video2 || videoData.play;

            return res.json({
                success: true,
                message: 'Video berhasil ditemukan!',
                downloadUrl: downloadUrl,
                title: videoData.description || 'TikTok Video'
            });
        } else {
            return res.status(400).json({ error: 'Gagal mengambil data video TikTok.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
});

module.exports = app;
