import 'dotenv/config';
import dns from 'dns';
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

import app from './app';
import logger from './logger';
import { pool } from './db';

const PORT = process.env.PORT || 3002;

async function startServer() {
  try {
    await pool.query(`
      ALTER TABLE bed_assignments ADD COLUMN IF NOT EXISTS admission_id UUID;
    `);
    logger.info('Database migrations applied successfully');
  } catch (err: any) {
    logger.error('Failed to run startup migrations:', err.message);
  }

  app.listen(PORT, () => {
    logger.info(`Staff Service running on PORT ${PORT}`);
  });
}

startServer();
