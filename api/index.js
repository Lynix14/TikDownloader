const express = require('express');
const cors = require('cors');

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
        // Menggunakan API publik TikWM yang mendukung link vt.tiktok.com
        const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(fileUrl)}`);
        const data = await response.json();

        if (data.code === 0 && data.data) {
            const videoData = data.data;
            // Ambil URL video tanpa watermark
            const downloadUrl = videoData.play;

            return res.json({
                success: true,
                message: 'Video berhasil ditemukan!',
                downloadUrl: downloadUrl,
                title: videoData.title || 'TikTok Video'
            });
        } else {
            return res.status(400).json({ error: data.msg || 'Gagal mengambil data video TikTok.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Terjadi kesalahan pada server backend.' });
    }
});

module.exports = app;
