import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { pool } from '../src/lib/server/db';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

async function init() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  console.log('🚀 Initializing database tables via Neon HTTP API...');

  const sql = neon(connectionString);

  // Helper query runner using sql.query
  async function query(queryText: string, params: any[] = []): Promise<any[]> {
    if (connectionString?.includes('neon.tech')) {
      const res = await sql.query(queryText, params);
      return res as any[];
    } else {
      const res = await (pool as any).query(queryText, params);
      return res.rows;
    }
  }

  // 1. Departments
  await query(`
    CREATE TABLE IF NOT EXISTS departments (
      id UUID PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT now()
    );
  `);

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
    await query(
      `INSERT INTO departments (id, name) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING`,
      [randomUUID(), dep]
    );
  }

  // 2. Patients & Profiles
  await query(`
    CREATE TABLE IF NOT EXISTS patients (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      dob DATE,
      gender TEXT,
      phone TEXT,
      role TEXT DEFAULT 'PATIENT',
      profile_image TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS patient_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      patient_id UUID UNIQUE NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
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

  await query(`
    CREATE TABLE IF NOT EXISTS patient_documents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      file_url TEXT NOT NULL,
      file_key TEXT NOT NULL,
      file_name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS patient_refresh_tokens (
      id UUID PRIMARY KEY,
      patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      revoked BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  // 3. Staff & Staff Tokens
  await query(`
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

  await query(`
    CREATE TABLE IF NOT EXISTS staff_refresh_tokens (
      id UUID PRIMARY KEY,
      staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      revoked BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  // Seed default Doctor & Staff accounts
  const deptRows = await query(
    `SELECT id FROM departments WHERE name = 'General Medicine' LIMIT 1`
  );
  const genMedId = deptRows[0]?.id;

  if (genMedId) {
    const adminPass = await bcrypt.hash('123', 10);
    await query(
      `
      INSERT INTO staff (id, name, email, password_hash, department_id, role, job_title)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO UPDATE SET password_hash = $4, role = $6
      `,
      [
        randomUUID(),
        'System Admin',
        'admin@gmail.com',
        adminPass,
        genMedId,
        'ADMIN',
        'System Administrator',
      ]
    );

    const doctorPass = await bcrypt.hash('Doctor123!', 10);
    await query(
      `
      INSERT INTO staff (id, name, email, password_hash, department_id, role, job_title)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO NOTHING
      `,
      [
        randomUUID(),
        'Dr. Sarah Connor',
        'doctor@hos.com',
        doctorPass,
        genMedId,
        'DOCTOR',
        'Chief Medical Officer',
      ]
    );

    const nursePass = await bcrypt.hash('Nurse123!', 10);
    await query(
      `
      INSERT INTO staff (id, name, email, password_hash, department_id, role, job_title)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO NOTHING
      `,
      [
        randomUUID(),
        'Nurse John Doe',
        'nurse@hos.com',
        nursePass,
        genMedId,
        'NURSE',
        'Head Nurse',
      ]
    );
  }

  // 4. Appointments & Admissions
  await query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id UUID PRIMARY KEY,
      doctor_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
      patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      appointment_time TIMESTAMP NOT NULL,
      duration_minutes INT NOT NULL DEFAULT 15,
      status TEXT NOT NULL DEFAULT 'SCHEDULED',
      priority TEXT NOT NULL DEFAULT 'NORMAL',
      check_in_time TIMESTAMP NULL,
      actual_start_time TIMESTAMP NULL,
      actual_end_time TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `);

  await query(`
    CREATE UNIQUE INDEX IF NOT EXISTS unique_doctor_slot
    ON appointments (doctor_id, appointment_time);
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS admissions (
      id UUID PRIMARY KEY,
      patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      doctor_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
      department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
      status TEXT NOT NULL DEFAULT 'REQUESTED',
      discharge_requested BOOLEAN DEFAULT false,
      discharge_requested_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT now(),
      admitted_at TIMESTAMP,
      discharged_at TIMESTAMP
    );
  `);

  // 5. Bed Management (Wards, Rooms, Beds, Bed Assignments)
  await query(`
    CREATE TABLE IF NOT EXISTS wards (
      id UUID PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS rooms (
      id UUID PRIMARY KEY,
      ward_id UUID REFERENCES wards(id) ON DELETE CASCADE,
      room_number TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now(),
      UNIQUE (ward_id, room_number)
    );
  `);

  await query(`
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

  await query(`
    CREATE TABLE IF NOT EXISTS bed_assignments (
      id UUID PRIMARY KEY,
      bed_id UUID REFERENCES beds(id) ON DELETE CASCADE,
      patient_id UUID NOT NULL,
      admission_id UUID,
      assigned_at TIMESTAMP DEFAULT now(),
      discharged_at TIMESTAMP
    );
  `);

  // Seed default Ward, Room, Bed
  const wardId = randomUUID();
  await query(
    `INSERT INTO wards (id, name, description) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING`,
    [wardId, 'General ICU Ward', 'Main Intensive Care & General Ward']
  );

  const wardRows = await query(
    `SELECT id FROM wards WHERE name = 'General ICU Ward' LIMIT 1`
  );
  if (wardRows[0]) {
    const roomId = randomUUID();
    await query(
      `INSERT INTO rooms (id, ward_id, room_number) VALUES ($1, $2, $3) ON CONFLICT (ward_id, room_number) DO NOTHING`,
      [roomId, wardRows[0].id, '101']
    );

    const roomRows = await query(
      `SELECT id FROM rooms WHERE ward_id = $1 AND room_number = '101' LIMIT 1`,
      [wardRows[0].id]
    );
    if (roomRows[0]) {
      for (const bedNo of ['Bed-A', 'Bed-B', 'Bed-C']) {
        await query(
          `INSERT INTO beds (id, room_id, bed_number, status) VALUES ($1, $2, $3, 'AVAILABLE') ON CONFLICT (room_id, bed_number) DO NOTHING`,
          [randomUUID(), roomRows[0].id, bedNo]
        );
      }
    }
  }

  // 6. Inventory & Pharmacy
  await query(`
    CREATE TABLE IF NOT EXISTS inventory_items (
      id UUID PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      quantity INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS inventory_transactions (
      id UUID PRIMARY KEY,
      item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      quantity INT NOT NULL,
      staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
      patient_id UUID,
      timestamp TIMESTAMP DEFAULT now()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS prescriptions (
      id UUID PRIMARY KEY,
      patient_id UUID NOT NULL,
      patient_name TEXT,
      doctor_id UUID REFERENCES staff(id) ON DELETE CASCADE,
      status TEXT DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS prescription_items (
      id UUID PRIMARY KEY,
      prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
      item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
      quantity INT NOT NULL,
      instructions TEXT
    );
  `);

  const defaultMedicines = [
    { name: 'Paracetamol 500mg', category: 'MEDICINE', quantity: 500 },
    { name: 'Amoxicillin 250mg', category: 'MEDICINE', quantity: 200 },
    { name: 'Ibuprofen 400mg', category: 'MEDICINE', quantity: 300 },
    { name: 'Cetirizine 10mg', category: 'MEDICINE', quantity: 100 },
    { name: 'Pantoprazole 40mg', category: 'MEDICINE', quantity: 150 },
    { name: 'Syringes 5ml', category: 'CONSUMABLE', quantity: 1000 },
    { name: 'Medical Gauze', category: 'CONSUMABLE', quantity: 2000 },
  ];

  for (const med of defaultMedicines) {
    await query(
      `INSERT INTO inventory_items (id, name, category, quantity) VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO NOTHING`,
      [randomUUID(), med.name, med.category, med.quantity]
    );
  }

  console.log(
    '🎉 Database schema and seed data initialized successfully via Neon HTTP API!'
  );
  process.exit(0);
}

init().catch((err) => {
  console.error('❌ Database initialization error:', err);
  process.exit(1);
});
