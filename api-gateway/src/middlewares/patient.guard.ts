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

  const pathParts = req.path.split('/');
  const patientIdFromPath = pathParts[1];

  /**
   * Allow special routes
   */
  if (
    patientIdFromPath === 'me' ||
    patientIdFromPath === 'upload' ||
    patientIdFromPath === 'profile-image' ||
    patientIdFromPath === 'documents'
  ) {
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
