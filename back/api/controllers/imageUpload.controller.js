import cloudinary from '../utils/cloudinary.js';
import upload from '../utils/multer.js';

// Middleware for file handling
export const uploadMiddleware = upload.single('file');

// Controller to handle Cloudinary uploads
export const ImageUploader = async (req, res, next) => {
  try {
    // Check if a file exists in the request
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded!' });
    }
    // Check if a file format is acceptable
    const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedFormats.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file format! Only jpg, png, and jpeg are allowed.' });
    }

    // Upload to Cloudinary
    const uniqueFilename = req.body.public_id; // Use the filename generated on the frontend
    
    const result = await cloudinary.uploader.upload(req.file.path, {
      // folder: 'user-profile-image', 
      // Optional: Organize files in folders
      public_id: uniqueFilename,
    });

    // Respond with the uploaded image URL
    res.status(200).json({
      message: 'Image uploaded successfully!',
      url: result.secure_url, // URL for the uploaded image
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error.message);
    res.status(500).json({ error: 'Failed to upload image', details: error.message });
  }
};
