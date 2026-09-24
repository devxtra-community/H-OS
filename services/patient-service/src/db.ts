import 'dotenv/config';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
  keepAlive: true,
});

pool.on('connect', () => {
  console.log('Patient Service DB connected');
});

pool.on('error', (err) => {
  console.error('Patient Service DB pool error:', err.message);
});
