import { pool } from '../src/db';

async function init() {
  // Staff table (if not already created elsewhere)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS staff (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      department TEXT NOT NULL,
      role TEXT NOT NULL,
      job_title TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `);

  // Doctor availability table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS doctor_availability (
      id UUID PRIMARY KEY,
      doctor_id UUID NOT NULL,
      day_of_week INT NOT NULL, -- 0=Sunday
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      slot_duration INT NOT NULL DEFAULT 15,
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  console.log('✅ staff + doctor_availability tables ready');
  process.exit(0);
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
