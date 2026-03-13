import { pool } from '../src/db';

async function init() {
  /**
   * PATIENTS TABLE
   * Core identity information
   */
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

  // Admissions table

  await pool.query(`CREATE TABLE IF NOT EXISTS admissions (
  id UUID PRIMARY KEY,
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  department_id UUID NOT NULL,

  status TEXT NOT NULL DEFAULT 'REQUESTED',

  created_at TIMESTAMP DEFAULT now(),
  admitted_at TIMESTAMP,
  discharged_at TIMESTAMP
);`);
  /**
   * PATIENT PROFILES TABLE
   * Extended medical + personal information
   */
  await pool.query(`
  CREATE TABLE IF NOT EXISTS patient_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    patient_id UUID UNIQUE NOT NULL
      REFERENCES patients(id)
      ON DELETE CASCADE,

    blood_group TEXT,
    height_cm INT,
    weight_kg INT,

    allergies TEXT,
    chronic_conditions TEXT,

    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    pincode TEXT,

    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relation TEXT,

    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
  );
`);

  /**
   * APPOINTMENTS TABLE
   * Hybrid queue + appointment system
   */
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

  /**
   * PREVENT DOUBLE BOOKING
   */
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS unique_doctor_slot
    ON appointments (doctor_id, appointment_time);
  `);

  console.log('✅ patients + patient_profiles + appointments tables ready');
  process.exit(0);
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
