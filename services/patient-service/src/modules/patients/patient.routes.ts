// services/patient-service/src/modules/patients/patient.routes.ts
import { Router } from 'express';
import { patientController } from './patient.controller';

const router = Router();

router.get('/:id', (req, res) => patientController.getPatientById(req, res));

router.put('/:id', (req, res) => patientController.updatePatient(req, res));

router.delete('/:id', (req, res) =>
  patientController.deactivatePatient(req, res)
);

export default router;
