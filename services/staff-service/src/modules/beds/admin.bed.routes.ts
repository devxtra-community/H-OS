import { Router } from 'express';
import { BedsController } from './bed.controller';

const router = Router();
const controller = new BedsController();

// ADMIN INFRASTRUCTURE MANAGEMENT

router.get('/wards', controller.getWards.bind(controller));

router.get('/rooms/:wardId', controller.getRooms.bind(controller));

router.post('/wards', controller.createWard.bind(controller));

router.post('/rooms', controller.createRoom.bind(controller));

router.post('/beds', controller.createBed.bind(controller));

export default router;
