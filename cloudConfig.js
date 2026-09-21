const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "TravelStay_DEV", // The folder in my Cloudinary account where images will be stored
    allowedFormats: ["jpg", "png", "jpeg"], // Allowed image formats
  },
});

module.exports = {
  cloudinary,
  storage,
};
