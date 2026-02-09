import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';
import { patientAuthProxy } from './proxy/patient.auth.proxy';
import { patientDataProxy } from './proxy/patient.data.proxy';
import { authenticate } from './middlewares/auth.middleware';
import { requirePatientSelf } from './middlewares/patient.guard';

const app = express();

app.use(cors());

// health
app.use('/health', healthRoutes);

// 🔓 PUBLIC auth (NO JWT)
app.use('/patients/public', patientAuthProxy);

// 🔐 PROTECTED patient data
app.use('/patients', authenticate, requirePatientSelf, patientDataProxy);

export default app;
