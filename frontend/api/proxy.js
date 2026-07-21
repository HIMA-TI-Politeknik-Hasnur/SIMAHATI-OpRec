const API_BACKEND = 'https://simahati-oprec.infinityfreeapp.com';

module.exports = async (req, res) => {
  const url = req.url.replace(/^\/api\/proxy/, '');
  const target = API_BACKEND + url;

  try {
    const headers = {
      'Accept': req.headers.accept || 'application/json',
      ...(req.headers.authorization ? { 'Authorization': req.headers.authorization } : {}),
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      headers['Content-Type'] = req.headers['content-type'] || 'application/json';
    }

    const resp = await fetch(target, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch {
    res.status(500).json({ message: 'Gagal terhubung ke server. Pastikan backend sudah berjalan.' });
  }
};
