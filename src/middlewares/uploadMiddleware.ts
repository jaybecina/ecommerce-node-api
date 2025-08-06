import { Request, Response, NextFunction } from 'express';
import { FileFilterCallback } from 'multer';
import multer from 'multer';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, r2Config } from '../config/r2.config.js';
import { RequestHandler } from 'express';

// Allowed file types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed'));
      return;
    }
    cb(null, true);
  },
});

// Middleware to handle file upload to R2
export const uploadToR2: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  // Generate a unique filename with proper extension
  const fileExtension = req.file.originalname.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;

  const uploadParams = {
    Bucket: r2Config.bucketName,
    Key: `products/${fileName}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
    CacheControl: 'public, max-age=31536000',
  };

  s3Client
    .send(new PutObjectCommand(uploadParams))
    .then(() => {
      req.body.imageUrl = `${r2Config.publicUrl}/products/${fileName}`;
      next();
    })
    .catch((error) => {
      console.error('Error uploading to R2:', error);
      res.status(500).json({
        message: 'Error uploading file',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    });
};

// Export multer middleware configured for single file upload
export const uploadMiddleware = upload.single('image');
