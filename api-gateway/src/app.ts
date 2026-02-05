import express from 'express';
import healthRouter from './routes/health';
import { patientProxy } from './proxy/patient.proxy';

const app = express();

// Debug middleware
app.use((req, res, next) => {
  console.log(' GATEWAY REQUEST:', req.method, req.originalUrl);
  next();
});

app.use('/health', healthRouter);
app.use('/patients', patientProxy);

// ✅ FIXED catch-all route
app.use((req, res) => {
  console.log(' NO ROUTE MATCHED:', req.method, req.originalUrl);
  res.status(404).json({
    error: 'Route not found in gateway',
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

export default app;
