import { pool } from '../src/db.ts';
import { randomUUID } from 'crypto';

async function init() {
  /**
   * 1️⃣ Departments Table
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS departments (
      id UUID PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  /**
   * Seed default departments
   */
  const defaultDepartments = [
    'Cardiology',
    'Orthopedics',
    'Neurology',
    'Pediatrics',
    'General Medicine',
    'Radiology',
    'Emergency',
  ];

  for (const dep of defaultDepartments) {
    await pool.query(
      `
      INSERT INTO departments (id, name)
      VALUES ($1, $2)
      ON CONFLICT (name) DO NOTHING
      `,
      [randomUUID(), dep]
    );
  }

  /**
   * 2️⃣ Staff Table (FOREIGN KEY version)
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS staff (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
      role TEXT NOT NULL,
      job_title TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `);

  /**
   * 3️⃣ Doctor Availability Table
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS doctor_availability (
      id UUID PRIMARY KEY,
      doctor_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
      day_of_week INT NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      slot_duration INT NOT NULL DEFAULT 15,
      created_at TIMESTAMP DEFAULT now(),
      UNIQUE (doctor_id, day_of_week)
    );
  `);

  console.log('✅ departments + staff + doctor_availability tables ready');
  process.exit(0);
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
