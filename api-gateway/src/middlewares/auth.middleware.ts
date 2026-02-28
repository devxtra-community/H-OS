import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { error } from 'node:console';

// console.log('JWT_SECRET in gateway:', process.env.JWT_SECRET);

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    type: 'PATIENT' | 'STAFF' | 'ADMIN';

    // present for STAFF / PATIENT
    role?: string;

    // present for STAFF
    job_title?: 'HEAD_STAFF' | 'STAFF';
    department?: string;
  };
}

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AuthenticatedRequest['user'];

    req.user = payload;
    next();
  } catch (err: any) {
    console.error('JWT VERIFY ERROR:', err.name, err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
