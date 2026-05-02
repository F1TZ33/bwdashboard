const { put } = require('@vercel/blob');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

function parseForm(req) {
  const form = formidable({ multiples: false, maxFileSize: 4.5 * 1024 * 1024 });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.json({ error: 'Method not allowed' });
  }
  try {
    const { fields, files } = await parseForm(req);
    const slug = String(Array.isArray(fields.slug) ? fields.slug[0] : (fields.slug || '')).trim().toLowerCase();
    const imageInput = files.image || files.file;
    const image = Array.isArray(imageInput) ? imageInput[0] : imageInput;
    if (!slug || !image) {
      res.statusCode = 400;
      return res.json({ error: 'Missing slug or image' });
    }
    const original = image.originalFilename || 'upload.jpg';
    const ext = (path.extname(original) || '.jpg').toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      res.statusCode = 400;
      return res.json({ error: 'Use JPG, PNG, or WEBP.' });
    }
    const filename = `product-images/${slug}-${Date.now()}${ext}`;
    const blob = await put(filename, fs.createReadStream(image.filepath), {
      access: 'public',
      contentType: image.mimetype || undefined,
      addRandomSuffix: false,
    });
    return res.json({ url: blob.url, pathname: blob.pathname });
  } catch (error) {
    res.statusCode = 500;
    return res.json({ error: 'Upload failed. Check size and file type.' });
  }
};
