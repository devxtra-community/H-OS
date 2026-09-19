import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface UserPayload {
  sub: string;
  type: 'PATIENT' | 'STAFF' | 'ADMIN';
  role?: string;
  job_title?: 'HEAD_STAFF' | 'STAFF';
  department?: string;
}

export const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export function getAuthUser(req: NextRequest): UserPayload | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as UserPayload;
    return payload;
  } catch (err) {
    return null;
  }
}
