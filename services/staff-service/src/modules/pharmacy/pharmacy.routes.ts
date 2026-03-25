import { Router } from 'express';
import { PharmacyController } from './pharmacy.controller';

const router = Router();
const controller = new PharmacyController();

router.post('/', controller.createPrescription.bind(controller));
router.get('/pending', controller.getPending.bind(controller));
router.post('/:id/dispense', controller.dispense.bind(controller));

export default router;
