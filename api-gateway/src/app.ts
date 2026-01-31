import express from 'express';
import healthRouter from './routes/health';
import { patientProxy } from './proxy/patient.proxy';

const app = express();

app.use(express.json());

app.use('/health', healthRouter);

app.use('/patients', patientProxy);

export default app;
//coppppddd
