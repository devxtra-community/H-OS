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
    // 1. Ensure required tables exist in destination
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

    // 2. Department Mapping
    const destDeptsRes = await destPool.query(
      `SELECT id, name FROM departments`
    );
    const deptNameToDestId = new Map<string, string>();
    for (const d of destDeptsRes.rows) {
      deptNameToDestId.set(d.name.toLowerCase().trim(), d.id);
    }

    const srcDepts = await srcPool.query(`SELECT id, name FROM departments`);
    const srcDeptIdToName = new Map<string, string>();
    for (const d of srcDepts.rows) {
      const cleanName = d.name.toLowerCase().trim();
      srcDeptIdToName.set(d.id, cleanName);

      if (!deptNameToDestId.has(cleanName)) {
        await destPool.query(
          `INSERT INTO departments (id, name, created_at)
           VALUES ($1, $2, $3)
           ON CONFLICT (name) DO NOTHING`,
          [d.id, d.name, d.created_at || new Date()]
        );
        const refetch = await destPool.query(
          `SELECT id FROM departments WHERE LOWER(TRIM(name)) = $1`,
          [cleanName]
        );
        if (refetch.rows[0]) {
          deptNameToDestId.set(cleanName, refetch.rows[0].id);
        }
      }
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
          a.is_active ?? true,
          a.created_at || new Date(),
          a.updated_at || new Date(),
        ]
      );
    }

    // 4. Sync Staff
    const srcStaff = await srcPool.query(`SELECT * FROM staff`);
    for (const s of srcStaff.rows) {
      const deptName = srcDeptIdToName.get(s.department_id);
      const targetDeptId =
        (deptName && deptNameToDestId.get(deptName)) || s.department_id;

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
          targetDeptId,
          s.role,
          s.job_title,
          s.is_active ?? true,
          s.created_at || new Date(),
          s.updated_at || new Date(),
        ]
      );
    }

    // 5. Sync Wards
    const wardSrcToDestId = new Map<string, string>();
    const srcWards = await srcPool.query(`SELECT * FROM wards`);
    for (const w of srcWards.rows) {
      const existing = await destPool.query(
        `SELECT id FROM wards WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))`,
        [w.name]
      );
      if (existing.rows[0]) {
        wardSrcToDestId.set(w.id, existing.rows[0].id);
        if (w.description) {
          await destPool.query(
            `UPDATE wards SET description = $1 WHERE id = $2`,
            [w.description, existing.rows[0].id]
          );
        }
      } else {
        await destPool.query(
          `INSERT INTO wards (id, name, description, created_at)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description`,
          [w.id, w.name, w.description, w.created_at || new Date()]
        );
        wardSrcToDestId.set(w.id, w.id);
      }
    }

    // 6. Sync Rooms
    const roomSrcToDestId = new Map<string, string>();
    const srcRooms = await srcPool.query(`SELECT * FROM rooms`);
    for (const r of srcRooms.rows) {
      const destWardId = wardSrcToDestId.get(r.ward_id) || r.ward_id;
      const existing = await destPool.query(
        `SELECT id FROM rooms WHERE ward_id = $1 AND room_number = $2`,
        [destWardId, r.room_number]
      );
      if (existing.rows[0]) {
        roomSrcToDestId.set(r.id, existing.rows[0].id);
      } else {
        await destPool
          .query(
            `INSERT INTO rooms (id, ward_id, room_number, created_at)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (ward_id, room_number) DO NOTHING`,
            [r.id, destWardId, r.room_number, r.created_at || new Date()]
          )
          .catch(() => {});
        roomSrcToDestId.set(r.id, r.id);
      }
    }

    // 7. Sync Beds
    const bedSrcToDestId = new Map<string, string>();
    const srcBeds = await srcPool.query(`SELECT * FROM beds`);
    for (const b of srcBeds.rows) {
      const destRoomId = roomSrcToDestId.get(b.room_id) || b.room_id;
      await destPool
        .query(
          `INSERT INTO beds (id, room_id, bed_number, bed_type, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (room_id, bed_number) DO UPDATE SET
           status = EXCLUDED.status,
           bed_type = EXCLUDED.bed_type`,
          [
            b.id,
            destRoomId,
            b.bed_number,
            b.bed_type,
            b.status,
            b.created_at || new Date(),
          ]
        )
        .catch(() => {});
      bedSrcToDestId.set(b.id, b.id);
    }

    // 8. Sync Bed Assignments
    const srcBedAssign = await srcPool.query(`SELECT * FROM bed_assignments`);
    for (const ba of srcBedAssign.rows) {
      const destBedId = bedSrcToDestId.get(ba.bed_id) || ba.bed_id;
      await destPool
        .query(
          `INSERT INTO bed_assignments (id, bed_id, patient_id, admission_id, assigned_at, discharged_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
          [
            ba.id,
            destBedId,
            ba.patient_id,
            ba.admission_id,
            ba.assigned_at,
            ba.discharged_at,
          ]
        )
        .catch(() => {});
    }

    // 9. Sync Inventory Items
    const itemSrcToDestId = new Map<string, string>();
    const srcItems = await srcPool.query(`SELECT * FROM inventory_items`);
    for (const it of srcItems.rows) {
      const existing = await destPool.query(
        `SELECT id FROM inventory_items WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))`,
        [it.name]
      );
      if (existing.rows[0]) {
        itemSrcToDestId.set(it.id, existing.rows[0].id);
        await destPool.query(
          `UPDATE inventory_items SET quantity = $1, category = $2 WHERE id = $3`,
          [it.quantity, it.category, existing.rows[0].id]
        );
      } else {
        await destPool
          .query(
            `INSERT INTO inventory_items (id, name, category, quantity, created_at)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (name) DO UPDATE SET
             quantity = EXCLUDED.quantity,
             category = EXCLUDED.category`,
            [
              it.id,
              it.name,
              it.category,
              it.quantity,
              it.created_at || new Date(),
            ]
          )
          .catch(() => {});
        itemSrcToDestId.set(it.id, it.id);
      }
    }

    // 10. Sync Inventory Transactions
    const srcTx = await srcPool.query(`SELECT * FROM inventory_transactions`);
    for (const tx of srcTx.rows) {
      const destItemId = itemSrcToDestId.get(tx.item_id) || tx.item_id;
      await destPool
        .query(
          `INSERT INTO inventory_transactions (id, item_id, type, quantity, staff_id, patient_id, timestamp)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
          [
            tx.id,
            destItemId,
            tx.type,
            tx.quantity,
            tx.staff_id,
            tx.patient_id,
            tx.timestamp || new Date(),
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
            pr.created_at || new Date(),
          ]
        )
        .catch(() => {});
    }

    // 12. Sync Prescription Items
    const srcPrescItems = await srcPool.query(
      `SELECT * FROM prescription_items`
    );
    for (const pi of srcPrescItems.rows) {
      const destItemId = itemSrcToDestId.get(pi.item_id) || pi.item_id;
      await destPool
        .query(
          `INSERT INTO prescription_items (id, prescription_id, item_id, quantity, instructions)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
          [pi.id, pi.prescription_id, destItemId, pi.quantity, pi.instructions]
        )
        .catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: 'Staff and hospital infrastructure data synced successfully',
      synced: {
        departments: srcDepts.rows.length,
        admins: srcAdmins.rows.map((a) => a.email),
        staff: srcStaff.rows.map((s) => ({
          email: s.email,
          name: s.name,
          role: s.role,
        })),
        wards: srcWards.rows.length,
        rooms: srcRooms.rows.length,
        beds: srcBeds.rows.length,
        inventory_items: srcItems.rows.length,
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
