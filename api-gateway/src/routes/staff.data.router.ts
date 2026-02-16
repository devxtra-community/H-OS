import express from 'express';
import { requirePermission } from '../middlewares/rbac.middleware';
import { staffDataProxy } from '../proxy/staff.data.proxy';

const router = express.Router();

// 🔒 ADMIN ONLY: create staff
router.post('/', requirePermission('CREATE_STAFF'), staffDataProxy);

// everything else just passes through
router.use(staffDataProxy);

export default router;
