const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbzHWdTftVJxH5j71RMr3LOpgK1Ds9LfyF-1KW5BuDkc3gmcf3QxdlrhGbHO0VwJmJsX6Q/exec';

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, reason, gasUrl } = req.body || {};
    const targetGasUrl = gasUrl || process.env.GOOGLE_SHEETS_WEBAPP_URL || DEFAULT_GAS_URL;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nama Tersangka wajib diisi!',
      });
    }

    const newSubmission = {
      id: `sub-${Date.now()}`,
      name: name.trim(),
      reason: reason || 'Siap, Gasss Ndan!',
      timestamp: new Date().toISOString(),
      status: reason?.includes('istri')
        ? 'TERPANTAU CEMEN'
        : reason?.includes('duit')
        ? 'DONASI AIR PUTIH'
        : 'SIAP TEMPUR NONGKRONG',
    };

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
      } catch (gasErr) {
        console.warn('Gagal meneruskan ke Google Sheets:', gasErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Data terekam! Jangan lupa mandi sebelum ke WKS. Sampai jumpa jam 09.00!',
      data: newSubmission,
      forwardedToGas,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
    return res.status(500).json({
      success: false,
      error: message,
    });
  }
}
