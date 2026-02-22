import { Router } from 'express';
import { StaffController } from './staff.controller';

const router = Router();
const controller = new StaffController();

// ADMIN-only routes (gateway will enforce ADMIN later)
router.post('/', controller.createStaff.bind(controller));
router.get('/:id', controller.getStaffById.bind(controller));
router.put('/:id', controller.updateStaff.bind(controller));
router.delete('/:id', controller.deactivateStaff.bind(controller));
router.get(
  '/availability/:doctorId/:dayOfWeek',
  controller.getAvailability.bind(controller)
);

export default router;
