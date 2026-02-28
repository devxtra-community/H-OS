// services/patient-service/src/app.ts
import express from 'express';
import cookieParser from 'cookie-parser';
import patientRoutes from './modules/patients/patient.routes';
import healthRoutes from './routes/health';
import authRoutes from './modules/auth/auth.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import appointmentRoutes from './modules/appointments/appointment.routes';
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(
    `[Patient-Service] ${new Date().toISOString()} ${req.method} ${req.url}`
  );
  next();
});

app.use((req, res, next) => {
  console.log('ROUTE HIT:', req.method, req.originalUrl);
  next();
});
// 🔓 Public routes (auth)
app.use('/auth', authRoutes);

// Health check
app.use('/health', healthRoutes);

app.use('/patients', patientRoutes);

app.use('/appointments', appointmentRoutes);

// Error handling
app.use(errorMiddleware);

export default app;
