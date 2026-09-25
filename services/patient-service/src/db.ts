import 'dotenv/config';
import dns from 'dns';
import { Pool } from 'pg';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

function cleanConnectionString(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete('channel_binding');
    return parsed.toString();
  } catch {
    return url
      .replace(/([?&])channel_binding=[^&]+(&|$)/, '$1')
      .replace(/[?&]$/, '');
  }
}

export const pool = new Pool({
  connectionString: cleanConnectionString(process.env.DATABASE_URL),
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
  keepAlive: true,
  ssl: {
    rejectUnauthorized: false,
  },
  lookup: (hostname: string, _options: any, callback: any) => {
    dns.lookup(hostname, { family: 4 }, callback);
  },
} as any);

pool.on('connect', () => {
  console.log('Patient Service DB connected');
});

pool.on('error', (err) => {
  console.error('Patient Service DB pool error:', err.message);
});
