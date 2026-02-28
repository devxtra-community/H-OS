import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';
import { patientAuthProxy } from './proxy/patient.auth.proxy';
import { patientDataProxy } from './proxy/patient.data.proxy';
import { staffAuthProxy } from './proxy/staff.auth.proxy';
import staffDataRouter from './routes/staff.data.router';
import { authenticate } from './middlewares/auth.middleware';
import { requirePatientSelf } from './middlewares/patient.guard';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    credentials: true,
  })
);

// health
app.use('/health', healthRoutes);

// PUBLIC auth
app.use('/patients/public', patientAuthProxy);

// PATIENT self routes
app.use('/patients', authenticate, requirePatientSelf, patientDataProxy);

// STAFF auth
app.use('/staff/public', staffAuthProxy);
app.use('/staff', authenticate, staffDataRouter);

//Appointment routes (accessible by PATIENT + STAFF + ADMIN)

app.use(
  '/appointments',
  authenticate,
  (req: any, _res, next) => {
    if (req.user) {
      if (req.user.sub) req.headers['x-user-id'] = String(req.user.sub);

      if (req.user.role) req.headers['x-user-role'] = String(req.user.role);

      if (req.user.type) req.headers['x-user-type'] = String(req.user.type);
    }

    next();
  },
  createProxyMiddleware({
    target: process.env.PATIENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/appointments${path}`,
  })
);

export default app;
