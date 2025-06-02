const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../../middleware/MulterMiddleware');
const uploadQR = require('../../middleware/MulterQR');
const {
  uploadHomeDp,
  getHomeDp,
  deleteHomeDp,
  getAllHomeDps,
  uploadQrCode,
  getQrCode,
  deleteQrCode,
} = require('../../Controller/Admincontroller/homedpcontroller');

// Temporary debug route to see what fields are being sent
router.post('/debug-upload', multer().any(), (req, res) => {
  console.log('Files received:', req.files.map(f => ({ fieldname: f.fieldname, originalname: f.originalname })));
  res.json({ 
    message: 'Debug info', 
    files: req.files.map(f => ({ fieldname: f.fieldname, originalname: f.originalname }))
  });
});

// Use a simple multer instance that accepts any field
const simpleUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max size
}).any();

router.post('/upload', simpleUpload, uploadHomeDp);

router.get('/latest', getHomeDp);
router.delete('/delete/:id', deleteHomeDp);
router.get('/all-dpimage', getAllHomeDps);

// Same for QR code
const uploadQRFields = uploadQR.fields([
  { name: 'qrcode', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]);
router.post('/upload-qr', uploadQRFields, uploadQrCode);

router.get('/latest-qr', getQrCode);
router.delete('/delete-qr/:id', deleteQrCode);

module.exports = router;
