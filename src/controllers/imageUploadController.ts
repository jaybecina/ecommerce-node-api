import { RequestHandler } from 'express';

export const uploadProductImage: RequestHandler = (req, res) => {
  if (req.body.imageUrl) {
    res.status(201).json({
      success: true,
      imageUrl: req.body.imageUrl,
      message: 'Image uploaded successfully',
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'No image was uploaded',
    });
  }
};
