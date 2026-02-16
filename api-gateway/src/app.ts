import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';
import { patientAuthProxy } from './proxy/patient.auth.proxy';
import { patientDataProxy } from './proxy/patient.data.proxy';
import { staffAuthProxy } from './proxy/staff.auth.proxy';
// import { staffDataProxy } from './proxy/staff.data.proxy';
import staffDataRouter from './routes/staff.data.router';
import { authenticate } from './middlewares/auth.middleware';
import { requirePatientSelf } from './middlewares/patient.guard';

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// health
app.use('/health', healthRoutes);

// 🔓 PUBLIC auth (NO JWT)
app.use('/patients/public', patientAuthProxy);
// 🔐 PROTECTED patient data
app.use('/patients', authenticate, requirePatientSelf, patientDataProxy);

app.use('/staff/public', staffAuthProxy);
app.use('/staff', authenticate, staffDataRouter);

export default app;
