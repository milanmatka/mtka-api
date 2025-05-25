const HomeDp = require('../../modal/Adminmodal/homedpmodal');
const path = require('path');
const fs = require('fs');
const QRCode = require('../../modal/Adminmodal/QRModel');

exports.uploadHomeDp = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const savedFiles = await Promise.all(
      files.map(file => {
        const newDp = new HomeDp({ image: file.filename });
        return newDp.save();
      })
    );

    res.status(200).json({ message: 'Images uploaded successfully', data: savedFiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading images', error });
  }
};

exports.getHomeDp = async (req, res) => {
  try {
    const latestDp = await HomeDp.findOne().sort({ createdAt: -1 });
    res.status(200).json({ data: latestDp });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest DP', error });
  }
};

exports.getAllHomeDps = async (req, res) => {
  try {
    const allImages = await HomeDp.find().sort({ createdAt: -1 });
    res.status(200).json({ data: allImages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all DPs', error });
  }
};

exports.deleteHomeDp = async (req, res) => {
  try {
    const id = req.params.id;
    const dp = await HomeDp.findById(id);
    if (!dp) {
      return res.status(404).json({ message: 'DP image not found' });
    }

    const imagePath = path.join(__dirname, '../../uploads/homedp/', dp.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await HomeDp.findByIdAndDelete(id);
    res.status(200).json({ message: 'DP image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting DP image', error });
  }
};

//mujhe qr code ki photo upload karni hai
exports.uploadQrCode = async (req, res) => {
  try {
    // Support both single and multiple file uploads
    const files = req.files && Array.isArray(req.files) ? req.files : (req.file ? [req.file] : []);
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const savedFiles = await Promise.all(
      files.map(file => {
        const newDp = new QRCode({ image: file.filename });
        return newDp.save();
      })
    );

    res.status(200).json({ message: 'Images uploaded successfully', data: savedFiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading images', error });
  }
};

// mujhe qr code ki photo dekhni hai
exports.getQrCode = async (req, res) => {
  try {
    const latestDp = await QRCode.findOne().sort({ createdAt: -1 });
    res.status(200).json({ data: latestDp });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest DP', error });
  }
};

exports.deleteQrCode = async (req, res) => {
  try {
    const id = req.params.id;
    const dp = await QRCode.findById(id);
    if (!dp) {
      return res.status(404).json({ message: 'DP image not found' });
    }
    const imagePath = path.join(__dirname, '../../uploads/QRcode/', dp.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await QRCode.findByIdAndDelete(id);
    res.status(200).json({ message: 'DP image deleted successfully' });
  }
  catch (error) {
    res.status(500).json({ message: 'Error deleting DP image', error });
  }
}