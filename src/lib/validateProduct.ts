import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Correspond au productSchema Mongoose
const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(), // >= 0
  stock: z.number().int().nonnegative().optional(), // stock >= 0, par défaut: 0
  category: z.string().optional(),
});

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const result = productSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  next();
};
