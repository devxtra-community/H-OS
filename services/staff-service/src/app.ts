import express from 'express';
import cookieParser from 'cookie-parser';
import healthRouter from './routes/health';
import authRouter from './modules/auth/auth.routes';
import staffRouter from './modules/staff/staff.routes';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/health', healthRouter);
app.use('/auth', authRouter);

app.use('/staff', staffRouter);

export default app;
