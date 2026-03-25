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

  /**
   * 9️⃣ Inventory Tables
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS inventory_items (
      id UUID PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      quantity INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  await pool.query(`
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

  /**
   * 10️⃣ Pharmacy Tables
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS prescriptions (
      id UUID PRIMARY KEY,
      patient_id UUID NOT NULL,
      patient_name TEXT,
      doctor_id UUID REFERENCES staff(id) ON DELETE CASCADE,
      status TEXT DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS prescription_items (
      id UUID PRIMARY KEY,
      prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
      item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
      quantity INT NOT NULL,
      instructions TEXT
    );
  `);

  // Ensure instructions column exists if table was created previously
  await pool.query(`
    ALTER TABLE prescription_items ADD COLUMN IF NOT EXISTS instructions TEXT;
  `);

  /**
   * Seed default medicines
   */
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
    await pool.query(
      `INSERT INTO inventory_items (id, name, category, quantity)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (name) DO NOTHING`,
      [randomUUID(), med.name, med.category, med.quantity]
    );
  }

  console.log(
    '✅ departments + staff + doctor_availability + bed management + inventory + pharmacy tables + seeds ready'
  );

  process.exit(0);
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
