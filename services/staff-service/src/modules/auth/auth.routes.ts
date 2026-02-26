import { Router } from 'express';
import { AdminAuthController } from './admin.auth.controller';
import { StaffAuthController } from './staff.auth.controller';

const router = Router();

const adminController = new AdminAuthController();
const staffController = new StaffAuthController();

// Admin login
router.post('/admin/login', adminController.login.bind(adminController));

router.post('/admin/refresh', adminController.refresh.bind(adminController));

router.get('/admin/me', adminController.me.bind(adminController));

router.post('/admin/logout', adminController.logout.bind(adminController));

// Staff login
router.post('/login', staffController.login.bind(staffController));

// Refresh (staff only)
router.post('/refresh', staffController.refresh.bind(staffController));

router.post('/logout', staffController.logout.bind(staffController));

router.get('/me', staffController.me.bind(staffController));

export default router;
