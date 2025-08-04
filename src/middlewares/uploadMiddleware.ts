import multer from 'multer';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, r2Config } from '../config/r2.config';
import { Request, Response, NextFunction } from 'express';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Middleware to handle file upload to R2
export const uploadToR2 = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next();
    }

    const fileBuffer = req.file.buffer;
    const fileName = `${Date.now()}-${req.file.originalname}`;

    const uploadParams = {
      Bucket: r2Config.bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: req.file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Add the image URL to the request body
    req.body.imageUrl = `https://${r2Config.bucketName}.${r2Config.accountId}.r2.cloudflarestorage.com/${fileName}`;
    next();
  } catch (error) {
    next(error);
  }
};

// Export multer middleware configured for single file upload
export const uploadMiddleware = upload.single('image');
