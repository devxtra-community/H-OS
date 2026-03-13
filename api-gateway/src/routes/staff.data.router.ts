import express from 'express';
import { requirePermission } from '../middlewares/rbac.middleware';
import { staffDataProxy } from '../proxy/staff.data.proxy';

const router = express.Router();

// 🔒 ADMIN ONLY
router.post('/', requirePermission('CREATE_STAFF'), staffDataProxy);

// 🔒 BED MANAGEMENT
router.use('/beds', requirePermission('MANAGE_BEDS'), staffDataProxy);

// everything else
router.use(staffDataProxy);

export default router;
