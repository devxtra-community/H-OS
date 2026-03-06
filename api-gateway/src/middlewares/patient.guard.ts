import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export function requirePatientSelf(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.type !== 'PATIENT') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const patientIdFromPath = req.path.split('/')[1];

  if (!patientIdFromPath) {
    return res.status(400).json({ error: 'Invalid patient path' });
  }

  /**
   * Allow /patients/me directly
   */
  if (patientIdFromPath === 'me') {
    return next();
  }

  /**
   * Protect /patients/:id
   */
  if (req.user.sub !== patientIdFromPath) {
    return res.status(403).json({ error: 'Access denied' });
  }

  next();
}
