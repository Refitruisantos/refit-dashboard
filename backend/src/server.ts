import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dashboardRouter from './routes/dashboard.js';
import clientRoutes from './routes/clientRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import cashFlowRoutes from './routes/cashFlowRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://courageous-selkie-5332bb.netlify.app', 'http://localhost:5173']
    : 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', dashboardRouter);
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/cashflow', cashFlowRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 REFIT API running on http://localhost:${PORT}`);
});
