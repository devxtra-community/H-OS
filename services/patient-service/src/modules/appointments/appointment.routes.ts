import { Router } from 'express';
import { appointmentController } from './appointment.controller';

const router = Router();

router.post('/', (req, res) => appointmentController.book(req, res));

router.get('/my-status', (req, res) =>
  appointmentController.myStatus(req, res)
);

router.get('/history', (req, res) => appointmentController.history(req, res));

router.post('/check-in/:id', (req, res) =>
  appointmentController.checkIn(req, res)
);

router.post('/start/:id', (req, res) => appointmentController.start(req, res));

router.post('/complete/:id', (req, res) =>
  appointmentController.complete(req, res)
);

router.get('/doctor/today/:doctorId', (req, res) =>
  appointmentController.getDoctorQueue(req, res)
);

router.post('/set-priority/:id', (req, res) =>
  appointmentController.setPriority(req, res)
);

router.post('/cancel/:id', (req, res) =>
  appointmentController.cancel(req, res)
);

router.post('/reschedule/:id', (req, res) =>
  appointmentController.reschedule(req, res)
);

router.get('/available-slots', (req, res) =>
  appointmentController.availableSlots(req, res)
);

export default router;
