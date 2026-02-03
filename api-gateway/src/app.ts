import express from 'express';
import healthRouter from './routes/health';
import { patientProxy } from './proxy/patient.proxy';
import { staffProxy } from './proxy/staff.proxy';

const app = express();

app.use(express.json());

app.use('/health', healthRouter);

app.use('/patients', patientProxy);
app.use('/staff', staffProxy);

export default app;
