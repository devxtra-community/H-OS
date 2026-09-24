import 'dotenv/config';
import dns from 'dns';
import { Pool } from 'pg';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined for staff-service');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
  keepAlive: true,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('connect', () => {
  console.log('Staff Service DB connected');
});

pool.on('error', (err) => {
  console.error('Staff Service DB pool error:', err.message);
});
