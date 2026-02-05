import express from 'express';
import healthRouter from './routes/health.js';
import patientRoutes from './modules/patients/patient.routes.js';

const app = express();
app.use(express.json());

app.use('/health', healthRouter);
app.use('/patients', patientRoutes);

export default app;
