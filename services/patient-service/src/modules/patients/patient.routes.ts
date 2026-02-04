// patient.routes.ts

import { Router } from 'express';
import {
  createPatient,
  getPatient,
  updatePatient,
  deactivatePatient,
} from './patient.controller.js';

const router = Router();

router.post('/', createPatient);
router.get('/:id', getPatient);
router.patch('/:id', updatePatient);
router.delete('/:id', deactivatePatient);

export default router;
