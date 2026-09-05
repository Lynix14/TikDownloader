const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/process-media', async (req, res) => {
    const { fileUrl } = req.body;

    if (!fileUrl) {
        return res.status(400).json({ error: 'URL tidak boleh kosong' });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
module.exports = app;

