import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export type Permission =
  | 'CREATE_STAFF'
  | 'UPDATE_STAFF'
  | 'DEACTIVATE_STAFF'
  | 'MANAGE_BEDS';

const STAFF_ROLE_PERMISSIONS: Record<string, Permission[]> = {
  DOCTOR: [],
  NURSE: ['MANAGE_BEDS'],
  RECEPTIONIST: ['MANAGE_BEDS'],
};

export function requirePermission(permission: Permission) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // ADMIN can do everything
    if (user.type === 'ADMIN') {
      return next();
    }

    // Only STAFF can have role permissions
    if (user.type !== 'STAFF' || !user.role) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const rolePermissions = STAFF_ROLE_PERMISSIONS[user.role] ?? [];

    if (!rolePermissions.includes(permission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}
