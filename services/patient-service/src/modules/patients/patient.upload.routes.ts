import { Router } from 'express';
import { patientUploadController } from './patient.upload.controller';

const router = Router();

router.get('/upload-url', patientUploadController.getUploadUrl);
router.delete('/delete', patientUploadController.deleteFile);

export default router;
