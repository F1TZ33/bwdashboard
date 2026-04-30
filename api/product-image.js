const { list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    return res.json({ error: 'Method not allowed' });
  }
  const slug = String((req.query && req.query.slug) || '').trim().toLowerCase();
  if (!slug) {
    res.statusCode = 400;
    return res.json({ error: 'Missing slug' });
  }
  try {
    const { blobs } = await list({ prefix: `product-images/${slug}-`, limit: 1000 });
    const latest = (blobs || []).sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0] || null;
    return res.json({ url: latest ? latest.url : null });
  } catch (error) {
    res.statusCode = 500;
    return res.json({ error: 'Unable to load image' });
  }
};
