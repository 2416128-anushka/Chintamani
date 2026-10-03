const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const PORT = process.env.PORT || 3000;
const GNANI_API_KEY = process.env.GNANI_API_KEY;
const GNANI_STT_URL = 'https://api.vachana.ai/stt/v3';

app.use(express.static("."));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, gnaniKeyConfigured: Boolean(GNANI_API_KEY) });
});

app.post('/api/transcribe', upload.single('audio_file'), async (req, res) => {
  if (!GNANI_API_KEY) {
    return res.status(500).json({ error: 'GNANI_API_KEY is not configured.' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'audio_file is required.' });
  }

  try {
    const form = new FormData();
    form.append(
      'audio_file',
      new Blob([req.file.buffer], { type: req.file.mimetype || 'audio/wav' }),
      req.file.originalname || 'voice-note.wav'
    );
    form.append('language_code', 'en-IN');
    form.append('preferred_language', 'en-IN');
    form.append('format', 'transcribe');
    form.append('itn_native_numerals', 'true');

    const response = await fetch(GNANI_STT_URL, {
      method: 'POST',
      headers: {
        'X-API-Key-ID': GNANI_API_KEY
      },
      body: form
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Gnani request failed:', error);
    res.status(502).json({ error: error.message || 'Gnani request failed.' });
  }
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Chintamani running at http://localhost:${PORT}`);
});
