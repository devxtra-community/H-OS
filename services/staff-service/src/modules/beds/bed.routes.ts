import { Router } from 'express';
import { BedsController } from './bed.controller';

const router = Router();
const controller = new BedsController();

// STAFF OPERATIONS ONLY
router.get('/', controller.getBeds.bind(controller));

router.get('/wards', controller.getWards.bind(controller));

router.get('/rooms/:wardId', controller.getRooms.bind(controller));

router.get('/beds/:roomId', controller.getBedsByRoom.bind(controller));

router.post('/assign', controller.assignBed.bind(controller));

router.post('/discharge', controller.dischargePatient.bind(controller));

export default router;
