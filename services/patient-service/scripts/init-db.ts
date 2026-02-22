import { pool } from '../src/db';

async function init() {
  // Patients table
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

  // Appointments table (Hybrid-ready)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id UUID PRIMARY KEY,

      doctor_id UUID NOT NULL,
      patient_id UUID NOT NULL,

      appointment_time TIMESTAMP NOT NULL,
      duration_minutes INT NOT NULL DEFAULT 15,

      status TEXT NOT NULL DEFAULT 'SCHEDULED',
      priority TEXT NOT NULL DEFAULT 'NORMAL',

      check_in_time TIMESTAMP NULL,
      actual_start_time TIMESTAMP NULL,
      actual_end_time TIMESTAMP NULL,

      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),

      CONSTRAINT fk_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON DELETE CASCADE
    );
  `);

  // Prevent double booking
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS unique_doctor_slot
    ON appointments (doctor_id, appointment_time);
  `);

  console.log('✅ patients + appointments tables ready');
  process.exit(0);
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
