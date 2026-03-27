import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';
import { patientAuthProxy } from './proxy/patient.auth.proxy';
import { patientDataProxy } from './proxy/patient.data.proxy';
import { staffAuthProxy } from './proxy/staff.auth.proxy';
// import staffDataRouter from './routes/staff.data.router';
import { authenticate } from './middlewares/auth.middleware';
import { requirePatientSelf } from './middlewares/patient.guard';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { requirePermission } from './middlewares/rbac.middleware';
import { staffDataProxy } from './proxy/staff.data.proxy';
const app = express();

const frontendProxy = createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
});

const isPageRequest = (req: any) => {
  return (
    (req.method === 'GET' && req.headers.accept?.includes('text/html')) ||
    req.headers['rsc'] ||
    req.headers['next-router-prefetch'] ||
    req.headers['next-router-state-tree']
  );
};

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
app.use(
  '/patients',
  authenticate,
  requirePatientSelf,
  (req: any, _res, next) => {
    if (req.user?.sub) {
      req.headers['x-user-id'] = String(req.user.sub);
    }
    next();
  },
  patientDataProxy
);
// STAFF auth
app.use('/staff/public', staffAuthProxy);

const injectStaffHeaders = (req: any, _res: any, next: any) => {
  if (req.user) {
    if (req.user.sub) req.headers['x-user-id'] = String(req.user.sub);
    if (req.user.role) req.headers['x-user-role'] = String(req.user.role);
    if (req.user.type) req.headers['x-user-type'] = String(req.user.type);
  }
  next();
};

app.use(
  '/staff',
  (req, res, next) => {
    if (isPageRequest(req)) return next();
    authenticate(req, res, next);
  },
  injectStaffHeaders,
  (req, res, next) => {
    if (isPageRequest(req)) return next();
    staffDataProxy(req, res, next);
  }
);

app.use(
  '/admin',
  (req, res, next) => {
    if (isPageRequest(req)) return next();
    authenticate(req, res, next);
  },
  injectStaffHeaders,
  (req, res, next) => {
    if (isPageRequest(req)) return next();
    staffDataProxy(req, res, next);
  }
);

app.use(
  '/admissions',
  authenticate,
  (req: any, _res, next) => {
    if (req.user?.sub) req.headers['x-user-id'] = String(req.user.sub);

    if (req.user?.role) req.headers['x-user-role'] = String(req.user.role);

    if (req.user?.type) req.headers['x-user-type'] = String(req.user.type);

    next();
  },
  createProxyMiddleware({
    target: process.env.PATIENT_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: (path) =>
      `/admissions${path}`.replace(/\/$/, '') || '/admissions',
    on: {
      error: (err: any, req: any, res: any) => {
        console.error('[Gateway] /admissions proxy error:', err.message);
        if (!res.headersSent) {
          res.status(502).json({
            error: 'Patient service unavailable',
            details: err.message,
          });
        }
      },
    },
  })
);
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
    target: process.env.PATIENT_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: (path) =>
      `/appointments${path}`.replace(/\/$/, '') || '/appointments',
    on: {
      error: (err: any, req: any, res: any) => {
        console.error('[Gateway] /appointments proxy error:', err.message);
        if (!res.headersSent) {
          res.status(502).json({
            error: 'Patient service unavailable',
            details: err.message,
          });
        }
      },
    },
  })
);

app.use(
  '/prescriptions',
  authenticate,
  (req: any, _res, next) => {
    if (req.user?.sub) {
      req.headers['x-user-id'] = String(req.user.sub);
    }
    if (req.user?.role) req.headers['x-user-role'] = String(req.user.role);
    if (req.user?.type) req.headers['x-user-type'] = String(req.user.type);
    next();
  },
  createProxyMiddleware({
    target: process.env.STAFF_SERVICE_URL || 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: (path) => `/staff/pharmacy${path}`,
    on: {
      error: (err: any, req: any, res: any) => {
        console.error('[Gateway] /prescriptions proxy error:', err.message);
        if (!res.headersSent) {
          res
            .status(502)
            .json({ error: 'Staff service unavailable', details: err.message });
        }
      },
    },
  })
);

// Fallback to frontend for all other requests (pages, static assets, etc.)
app.use((req, res, next) => {
  frontendProxy(req, res, next);
});

export default app;
