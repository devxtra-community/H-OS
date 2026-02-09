import { pool } from '../src/db';

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS patients (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      dob DATE NOT NULL,
      gender TEXT NOT NULL,
      phone TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `);

  console.log('✅ patients table created');
  process.exit(0);
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
