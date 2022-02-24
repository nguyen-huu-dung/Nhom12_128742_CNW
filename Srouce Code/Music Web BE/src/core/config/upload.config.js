const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storageImage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'music-web-image',
    resource_type: 'image',
    allowedFormats: ['jpg', 'png', 'jpeg']
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});


const storageMusic = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'music-web-music',
    resource_type: 'video',
    allowedFormats: ['mp3', 'ogg']
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});

const uploadCloudImage = multer({ storage: storageImage }).single('image');
const uploadCloudMusic = multer({ storage: storageMusic }).single('music');

module.exports = { uploadCloudImage, uploadCloudMusic,cloudinary };