import express from 'express';
import cookieParser from 'cookie-parser';
import healthRouter from './routes/health';
import authRouter from './modules/auth/auth.routes';
import staffRouter from './modules/staff/staff.routes';
import bedRoutes from './modules/beds/bed.routes';
import adminBedRoutes from './modules/beds/admin.bed.routes';
import inventoryRouter from './modules/inventory/inventory.routes';
import pharmacyRouter from './modules/pharmacy/pharmacy.routes';
// import departmentRoutes from './modules/staff/department.routes'

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/staff/beds', bedRoutes);
app.use('/admin/beds', adminBedRoutes);

app.use('/staff/inventory', inventoryRouter);
app.use('/staff/pharmacy', pharmacyRouter);
app.use('/staff', staffRouter);
// app.use('/departments',departmentRoutes);

export default app;
