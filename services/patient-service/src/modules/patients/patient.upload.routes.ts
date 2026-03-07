import { Router } from 'express';
import { patientUploadController } from './patient.upload.controller';

const router = Router();

router.get('/upload-url', patientUploadController.getUploadUrl);

export default router;
