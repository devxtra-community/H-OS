import { pool } from '../src/db';
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
   * 2️⃣ Staff Table
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

  /**
   * 4️⃣ Wards Table
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS wards (
      id UUID PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  /**
   * 5️⃣ Rooms Table
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      id UUID PRIMARY KEY,
      ward_id UUID REFERENCES wards(id) ON DELETE CASCADE,
      room_number TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now(),
      UNIQUE (ward_id, room_number)
    );
  `);

  /**
   * 6️⃣ Beds Table
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS beds (
      id UUID PRIMARY KEY,
      room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
      bed_number TEXT NOT NULL,
      bed_type TEXT DEFAULT 'GENERAL',
      status TEXT DEFAULT 'AVAILABLE',
      created_at TIMESTAMP DEFAULT now(),
      UNIQUE (room_id, bed_number)
    );
  `);

  /**
   * 7️⃣ Bed Assignments Table
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bed_assignments (
      id UUID PRIMARY KEY,
      bed_id UUID REFERENCES beds(id) ON DELETE CASCADE,
      patient_id UUID NOT NULL,
      assigned_at TIMESTAMP DEFAULT now(),
      discharged_at TIMESTAMP
    );
  `);

  /**
   * 8️⃣ Index for fast lookup of active assignments
   */
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_active_bed_assignments
    ON bed_assignments (bed_id)
    WHERE discharged_at IS NULL;
  `);

  console.log(
    '✅ departments + staff + doctor_availability + bed management tables ready'
  );

  process.exit(0);
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
