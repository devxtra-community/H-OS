import { Router } from 'express';
import { AdminAuthController } from './admin.auth.controller';
import { StaffAuthController } from './staff.auth.controller';

const router = Router();

const adminController = new AdminAuthController();
const staffController = new StaffAuthController();

// Admin login
router.post('/admin/login', adminController.login.bind(adminController));

// Staff login
router.post('/login', staffController.login.bind(staffController));

// Refresh (staff only)
router.post('/refresh', staffController.refresh.bind(staffController));

router.get('/me', staffController.me.bind(staffController));

export default router;
