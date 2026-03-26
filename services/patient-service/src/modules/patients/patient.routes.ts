import { Router } from 'express';
import { patientController } from './patient.controller';
import uploadRoutes from './patient.upload.routes';
const router = Router();

/**
 * PROFILE ROUTES
 * MUST BE FIRST
 */

router.get('/me', (req, res) => patientController.getMyProfile(req, res));

router.patch('/me', (req, res) => patientController.updateMyProfile(req, res));

router.put('/profile-image', patientController.updateProfileImage);

router.use('/upload', uploadRoutes);

router.get('/documents', patientController.getDocuments);

router.post('/documents', patientController.saveDocument);

router.delete('/documents', patientController.deleteDocument);

/**
 * STANDARD ROUTES
 */

router.get('/:id', (req, res) => patientController.getPatientById(req, res));

router.put('/:id', (req, res) => patientController.updatePatient(req, res));

router.delete('/:id', (req, res) =>
  patientController.deactivatePatient(req, res)
);

router.post(
  '/bulk-info',
  patientController.getBulkInfo.bind(patientController)
);

export default router;
