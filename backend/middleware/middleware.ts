// middleware.ts
import { Request, Response, NextFunction } from 'express';

// Logging middleware
export const logger = (req: Request, res: Response, next: NextFunction) : void => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) : void => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
};

// Request validation middleware
export const validateUserInput = (req: Request, res: Response, next: NextFunction) : any  => {
  const { email, password } = req.body;
  if (!email || !password) {
     res.status(400).json({ message: 'Email and password are required' });
     return
  }
  next();
};
