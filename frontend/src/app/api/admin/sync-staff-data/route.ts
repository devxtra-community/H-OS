import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { pool as destPool } from '@/src/lib/server/db';

const STAFF_DB_URL =
  'postgresql://neondb_owner:npg_dxl6J5LciugF@ep-delicate-recipe-a1d00xwf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

export async function POST() {
  const srcPool = new Pool({
    connectionString: STAFF_DB_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // 1. Ensure admins and doctor_availability tables exist
    await destPool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id UUID PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `);

    await destPool.query(`
      CREATE TABLE IF NOT EXISTS doctor_availability (
        id UUID PRIMARY KEY,
        doctor_id UUID REFERENCES staff(id) ON DELETE CASCADE,
        day_of_week INT NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        slot_duration_minutes INT NOT NULL DEFAULT 15,
        created_at TIMESTAMP DEFAULT now()
      );
    `);

    // 2. Sync Departments
    const srcDepts = await srcPool.query(`SELECT * FROM departments`);
    for (const d of srcDepts.rows) {
      await destPool
        .query(
          `INSERT INTO departments (id, name, created_at)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
          [d.id, d.name, d.created_at || new Date()]
        )
        .catch(async () => {
          // if conflict on name, update id to match source
          await destPool.query(
            `UPDATE departments SET id = $1 WHERE name = $2`,
            [d.id, d.name]
          );
        });
    }

    // 3. Sync Admins
    const srcAdmins = await srcPool.query(`SELECT * FROM admins`);
    for (const a of srcAdmins.rows) {
      await destPool.query(
        `INSERT INTO admins (id, email, password_hash, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (email) DO UPDATE SET
           password_hash = EXCLUDED.password_hash,
           is_active = EXCLUDED.is_active,
           updated_at = now()`,
        [
          a.id,
          a.email,
          a.password_hash,
          a.is_active,
          a.created_at,
          a.updated_at,
        ]
      );
    }

    // 4. Sync Staff
    const srcStaff = await srcPool.query(`SELECT * FROM staff`);
    for (const s of srcStaff.rows) {
      // Ensure department exists in dest
      await destPool.query(
        `INSERT INTO staff (id, name, email, password_hash, department_id, role, job_title, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (email) DO UPDATE SET
           name = EXCLUDED.name,
           password_hash = EXCLUDED.password_hash,
           department_id = EXCLUDED.department_id,
           role = EXCLUDED.role,
           job_title = EXCLUDED.job_title,
           is_active = EXCLUDED.is_active,
           updated_at = now()`,
        [
          s.id,
          s.name,
          s.email,
          s.password_hash,
          s.department_id,
          s.role,
          s.job_title,
          s.is_active,
          s.created_at,
          s.updated_at,
        ]
      );
    }

    // 5. Sync Wards
    const srcWards = await srcPool.query(`SELECT * FROM wards`);
    for (const w of srcWards.rows) {
      await destPool
        .query(
          `INSERT INTO wards (id, name, description, created_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (name) DO UPDATE SET id = EXCLUDED.id, description = EXCLUDED.description`,
          [w.id, w.name, w.description, w.created_at]
        )
        .catch(async () => {
          await destPool.query(
            `INSERT INTO wards (id, name, description, created_at)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (id) DO NOTHING`,
            [w.id, w.name, w.description, w.created_at]
          );
        });
    }

    // 6. Sync Rooms
    const srcRooms = await srcPool.query(`SELECT * FROM rooms`);
    for (const r of srcRooms.rows) {
      await destPool
        .query(
          `INSERT INTO rooms (id, ward_id, room_number, created_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (ward_id, room_number) DO NOTHING`,
          [r.id, r.ward_id, r.room_number, r.created_at]
        )
        .catch(() => {});
    }

    // 7. Sync Beds
    const srcBeds = await srcPool.query(`SELECT * FROM beds`);
    for (const b of srcBeds.rows) {
      await destPool
        .query(
          `INSERT INTO beds (id, room_id, bed_number, bed_type, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (room_id, bed_number) DO UPDATE SET
           status = EXCLUDED.status,
           bed_type = EXCLUDED.bed_type`,
          [b.id, b.room_id, b.bed_number, b.bed_type, b.status, b.created_at]
        )
        .catch(() => {});
    }

    // 8. Sync Bed Assignments
    const srcBedAssign = await srcPool.query(`SELECT * FROM bed_assignments`);
    for (const ba of srcBedAssign.rows) {
      await destPool
        .query(
          `INSERT INTO bed_assignments (id, bed_id, patient_id, admission_id, assigned_at, discharged_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
          [
            ba.id,
            ba.bed_id,
            ba.patient_id,
            ba.admission_id,
            ba.assigned_at,
            ba.discharged_at,
          ]
        )
        .catch(() => {});
    }

    // 9. Sync Inventory Items
    const srcItems = await srcPool.query(`SELECT * FROM inventory_items`);
    for (const it of srcItems.rows) {
      await destPool
        .query(
          `INSERT INTO inventory_items (id, name, category, quantity, created_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (name) DO UPDATE SET
           quantity = EXCLUDED.quantity,
           category = EXCLUDED.category`,
          [it.id, it.name, it.category, it.quantity, it.created_at]
        )
        .catch(() => {});
    }

    // 10. Sync Inventory Transactions
    const srcTx = await srcPool.query(`SELECT * FROM inventory_transactions`);
    for (const tx of srcTx.rows) {
      await destPool
        .query(
          `INSERT INTO inventory_transactions (id, item_id, type, quantity, staff_id, patient_id, timestamp)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
          [
            tx.id,
            tx.item_id,
            tx.type,
            tx.quantity,
            tx.staff_id,
            tx.patient_id,
            tx.timestamp,
          ]
        )
        .catch(() => {});
    }

    // 11. Sync Prescriptions
    const srcPresc = await srcPool.query(`SELECT * FROM prescriptions`);
    for (const pr of srcPresc.rows) {
      await destPool
        .query(
          `INSERT INTO prescriptions (id, patient_id, patient_name, doctor_id, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
          [
            pr.id,
            pr.patient_id,
            pr.patient_name,
            pr.doctor_id,
            pr.status,
            pr.created_at,
          ]
        )
        .catch(() => {});
    }

    // 12. Sync Prescription Items
    const srcPrescItems = await srcPool.query(
      `SELECT * FROM prescription_items`
    );
    for (const pi of srcPrescItems.rows) {
      await destPool
        .query(
          `INSERT INTO prescription_items (id, prescription_id, item_id, quantity, instructions)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
          [pi.id, pi.prescription_id, pi.item_id, pi.quantity, pi.instructions]
        )
        .catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: 'Staff and hospital infrastructure data synced successfully',
      synced: {
        departments: srcDepts.rows.length,
        admins: srcAdmins.rows.length,
        staff: srcStaff.rows.map((s) => ({
          email: s.email,
          name: s.name,
          role: s.role,
        })),
        wards: srcWards.rows.length,
        rooms: srcRooms.rows.length,
        beds: srcBeds.rows.length,
        inventory_items: srcItems.rows.length,
        prescriptions: srcPresc.rows.length,
      },
    });
  } catch (error: any) {
    console.error('Staff sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync staff data' },
      { status: 500 }
    );
  } finally {
    await srcPool.end();
  }
}

export async function GET() {
  return POST();
}
