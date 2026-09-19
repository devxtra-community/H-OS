import { Pool as NeonPool } from '@neondatabase/serverless';
import { Pool as PgPool } from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgres://postgres:postgres@localhost:5432/hos_db';

const isNeon = connectionString.includes('neon.tech');

const globalForPg = global as unknown as { pool?: PgPool };

export const pool: PgPool = (globalForPg.pool ||
  (isNeon
    ? new NeonPool({ connectionString })
    : new PgPool({ connectionString }))) as unknown as PgPool;

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pool = pool;
}
