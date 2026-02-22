import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

// what actions exist in the system
export type Permission = 'CREATE_STAFF' | 'UPDATE_STAFF' | 'DEACTIVATE_STAFF';

// staff role → permissions
const STAFF_ROLE_PERMISSIONS: Record<string, Permission[]> = {
  DOCTOR: [],
  NURSE: [],
};

export function requirePermission(permission: Permission) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // ✅ ADMIN can do everything
    if (user.type === 'ADMIN') {
      return next();
    }

    // ❌ STAFF cannot do admin actions
    return res.status(403).json({ error: 'Forbidden' });
  };
}
