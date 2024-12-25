import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user-profile-image', // Specify a folder in Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg'], // Allowed file formats
  },
});

const upload = multer({ storage });

export default upload;
// module.exports = upload;
