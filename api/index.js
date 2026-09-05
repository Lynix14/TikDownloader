const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Backend Vercel Berhasil Jalan!' });
});

app.post('/api/process-media', async (req, res) => {
    const { fileUrl } = req.body;

    if (!fileUrl) {
        return res.status(400).json({ error: 'URL tidak ditemukan' });
    }

    try {
        res.json({
            success: true,
            message: 'Permintaan berhasil diproses',
            url: fileUrl
        });
    } catch (error) {
        res.status(500).json({ error: 'Gagal memproses media' });
    }
});

module.exports = app;
