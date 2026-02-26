import { Router } from 'express';
import { StaffController } from './staff.controller';

const router = Router();
const controller = new StaffController();

router.get('/departments', controller.getDepartments.bind(controller));
router.get('/doctors', controller.getDoctorsByDepartment.bind(controller));
router.post('/availability', controller.setAvailability.bind(controller));
router.get(
  '/availability/:doctorId/:dayOfWeek',
  controller.getAvailability.bind(controller)
);

router.post('/', controller.createStaff.bind(controller));
router.get('/:id', controller.getStaffById.bind(controller));
router.put('/:id', controller.updateStaff.bind(controller));
router.delete('/:id', controller.deactivateStaff.bind(controller));

export default router;
