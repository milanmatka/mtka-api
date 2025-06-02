const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the directory exists
const uploadPath = path.join(__dirname, '../uploads/QRcode');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = 'qr_' + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Filter image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png, webp) are allowed!'));
  }
};

// If your frontend is using a different field name, update it here
const uploadQR = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max size
  fileFilter
});

module.exports = uploadQR;
