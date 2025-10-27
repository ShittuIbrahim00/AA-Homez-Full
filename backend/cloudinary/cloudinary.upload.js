// middleware/cloudinaryUpload.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.config.js';
import { ErrorClass } from '../core/index.js';

// Base configuration
const getCloudinaryStorage = (folder) => new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder,
    public_id: `${folder}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    resource_type: file.mimetype.startsWith('image/') ? 'image' : 'raw',
    format: file.originalname.split('.').pop(),
  }),
});

// Single file upload generator
export const singleUpload = (options = {}) => {
  const {
    fieldName = 'image',
    folder = 'uploads',
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize = 10 * 1024 * 1024 // 10MB
  } = options;

  const upload = multer({
    storage: getCloudinaryStorage(folder),
    limits: { fileSize: maxFileSize },
    fileFilter: (req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error(`Only ${allowedTypes.join(', ')} allowed`), false);
      }
      cb(null, true);
    }
  }).single(fieldName);

  return (req, res, next) => handleUpload(req, res, next, upload);
};

// Multiple files upload generator
export const multipleUpload = (options = {}) => {
  const {
    fieldName = 'images',
    folder = 'uploads',
    maxCount = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize = 10 * 1024 * 1024 // 10MB per file
  } = options;

  const upload = multer({
    storage: getCloudinaryStorage(folder),
    limits: { fileSize: maxFileSize },
    fileFilter: (req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error(`Only ${allowedTypes.join(', ')} allowed`), false);
      }
      cb(null, true);
    }
  }).array(fieldName, maxCount);

  return (req, res, next) => handleUpload(req, res, next, upload);
};

// Reusable upload handler
const handleUpload = (req, res, next, upload) => {
  upload(req, res, (err) => {
    if (err) {
      console.error('Upload Error:', err);
      const message = err.message.includes('file size') 
        ? `File too large (max ${err.limit / (1024 * 1024)}MB)` 
        : err.message;
      return next(new ErrorClass(message, 400));
    }

    // Standardize response format
    if (req.file) {
      req.file.location = req.file.path; // Single file
    }
    if (req.files) {
      req.files.forEach(file => file.location = file.path); // Multiple files
    }

    next();
  });
};

// Profile image (single)
export const uploadProfileImage = singleUpload({
  fieldName: 'imgUrl',
  folder: 'profile_images',
  maxFileSize: 5 * 1024 * 1024 // 5MB
});

// Product images (multiple)
export const uploadProductImages = multipleUpload({
  fieldName: 'images',
  folder: 'product_images',
  maxCount: 10,
  maxFileSize: 8 * 1024 * 1024 // 8MB per image
});

// Configured specifically for property images
export const propertyImagesUpload = multipleUpload({
  fieldName: 'images', // Must match your form field name
  folder: 'property_images',
  maxCount: 20, // Adjust based on your needs
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize: 10 * 1024 * 1024 // 10MB per image
});