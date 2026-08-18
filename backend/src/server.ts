import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
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

// Initialize Prisma Client
const prisma = new PrismaClient();

// Apply migrations on startup
async function applyMigrations() {
  try {
    console.log('🔄 Checking database schema...');
    console.log('🔗 DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test database connection with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query test passed:', result);
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📊 Database tables:', tables);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('❌ Error details:', error.message);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
    ];
    
    // Permitir todas as URLs do Netlify
    if (!origin || allowedOrigins.includes(origin) || origin.includes('netlify.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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

// Start server
async function startServer() {
  await applyMigrations();
  
  app.listen(PORT, () => {
    console.log(`🚀 REFIT API running on http://localhost:${PORT}`);
  });
}

startServer();
