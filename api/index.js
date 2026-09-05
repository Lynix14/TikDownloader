const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Backend TikDownloader Vercel Berhasil!' });
});

app.post('/api/process-media', async (req, res) => {
    let { fileUrl } = req.body;

    if (!fileUrl) {
        return res.status(400).json({ error: 'URL tidak ditemukan' });
    }

    try {
        // 1. Jika link berupa vt.tiktok.com, resolve/redirect ke link panjang TikTok dahulu
        if (fileUrl.includes('vt.tiktok.com') || fileUrl.includes('vm.tiktok.com')) {
            const redirectRes = await fetch(fileUrl, {
                method: 'HEAD',
                redirect: 'follow',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            fileUrl = redirectRes.url || fileUrl;
        }

        // 2. Tembak TikWM API dengan headers User-Agent
        const tikwmUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(fileUrl)}&hd=1`;
        const response = await fetch(tikwmUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const data = await response.json();

        if (data && data.code === 0 && data.data) {
            const videoData = data.data;
            // Ambil URL video (tanpa watermark / HD)
            const downloadUrl = videoData.hdplay || videoData.play;

            return res.json({
                success: true,
                message: 'Video berhasil ditemukan!',
                downloadUrl: downloadUrl,
                title: videoData.title || 'TikTok Video'
            });
        } else {
            return res.status(400).json({ 
                error: (data && data.msg) ? data.msg : 'Gagal mengambil data dari TikTok.' 
            });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Terjadi kesalahan pada server backend.' });
    }
});

module.exports = app;
