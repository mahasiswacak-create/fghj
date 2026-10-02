import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Submission {
  id: string;
  name: string;
  reason: string;
  customReason?: string;
  timestamp: string;
  status: string;
}

// In-memory submissions log
const submissions: Submission[] = [
  {
    id: 'sub-sample-1',
    name: 'Budi "Wacana Sejati"',
    reason: 'Siap, Gasss Ndan!',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'TERVERIFIKASI INTEL',
  },
  {
    id: 'sub-sample-2',
    name: 'Rian "Ketinggalan Info"',
    reason: 'Gak ada duit',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'DIJAMIN AIR PUTIH GRATIS',
  },
];

const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbzHWdTftVJxH5j71RMr3LOpgK1Ds9LfyF-1KW5BuDkc3gmcf3QxdlrhGbHO0VwJmJsX6Q/exec';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Route for submissions
  app.get('/api/submissions', (_req, res) => {
    res.json({
      success: true,
      data: submissions,
    });
  });

  app.post('/api/submit', async (req, res) => {
    try {
      const { name, reason, customReason, gasUrl } = req.body;
      const targetGasUrl = gasUrl || process.env.GOOGLE_SHEETS_WEBAPP_URL || DEFAULT_GAS_URL;

      if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Nama Tersangka wajib diisi!',
        });
      }

      if (!reason || typeof reason !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Alasan Kehadiran wajib dipilih!',
        });
      }

      const newSubmission: Submission = {
        id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: name.trim(),
        reason,
        customReason: customReason || '',
        timestamp: new Date().toISOString(),
        status: reason.includes('istri')
          ? 'TERPANTAU CEMEN'
          : reason.includes('duit')
          ? 'DONASI AIR PUTIH'
          : 'SIAP TEMPUR NONGKRONG',
      };

      submissions.unshift(newSubmission);

      // Forward to Google Apps Script Web App
      let forwardedToGas = false;
      if (targetGasUrl && typeof targetGasUrl === 'string' && targetGasUrl.startsWith('http')) {
        try {
          await fetch(targetGasUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: newSubmission.name,
              reason: newSubmission.reason,
              timestamp: newSubmission.timestamp,
              status: newSubmission.status,
            }),
          });
          forwardedToGas = true;
          console.log(`[Google Sheets] Berhasil meneruskan data ${newSubmission.name} ke ${targetGasUrl}`);
        } catch (gasErr) {
          console.warn('Gagal mem-forward ke Google Apps Script:', gasErr);
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Data terekam! Jangan lupa mandi sebelum ke WKS. Sampai jumpa jam 09.00!',
        data: newSubmission,
        forwardedToGas,
      });
    } catch (err: unknown) {
      console.error('Submit error:', err);
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem internal';
      return res.status(500).json({
        success: false,
        error: message,
      });
    }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', server: 'BIN-WKS-Nongkrong-Gateway' });
  });

  // Setup Vite in middleware mode for dev
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SURAT PEMANGGILAN NONGKRONG] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
