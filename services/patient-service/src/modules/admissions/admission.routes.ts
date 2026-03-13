import { Router } from 'express';
import { AdmissionController } from './admission.controller';

const router = Router();
const controller = new AdmissionController();

router.post('/request', controller.requestAdmission.bind(controller));
router.get('/pending', controller.getPending.bind(controller));
router.post('/:id/admit', controller.admitPatient.bind(controller));

router.get('/doctor', controller.getDoctorAdmissions.bind(controller));
router.get(
  '/discharge-requests',
  controller.getDischargeRequests.bind(controller)
);

router.post(
  '/:id/request-discharge',
  controller.requestDischarge.bind(controller)
);
router.post('/:id/discharged', controller.completeDischarge.bind(controller));
export default router;
