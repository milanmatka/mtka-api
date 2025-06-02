const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Accept image files only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize upload
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max size
  fileFilter
});

// Create a more permissive version that accepts any field
const anyUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max size
  fileFilter
}).any();

module.exports = upload;
module.exports.anyUpload = anyUpload;
