import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { z, ZodError, ZodTypeAny } from 'zod';

export function validateData<T extends ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      // If schema is a ZodObject, use its shape keys for picking
      if (schema instanceof z.ZodObject) {
        req.cleanBody = _.pick(req.body, Object.keys(schema.shape));
      } else {
        req.cleanBody = req.body;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        res.status(400).json({ error: 'Invalid data', details: errorMessages });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
}
