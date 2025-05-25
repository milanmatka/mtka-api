const express = require('express');
const router = express.Router();
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

router.post('/upload', upload.array('homedp'), uploadHomeDp);
router.get('/latest', getHomeDp);
router.delete('/delete/:id', deleteHomeDp);
router.get('/all-dpimage', getAllHomeDps);
router.post('/upload-qr', uploadQR.single('qrcode'), uploadQrCode);
router.get('/latest-qr', getQrCode);
router.delete('/delete-qr/:id', deleteQrCode);


module.exports = router;
