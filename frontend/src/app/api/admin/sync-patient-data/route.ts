import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { pool as destPool } from '@/src/lib/server/db';

const SOURCE_DB_URL =
  'postgresql://neondb_owner:npg_kyv1weulT4UF@ep-winter-math-a1h9kjwg-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

export async function POST() {
  const srcPool = new Pool({
    connectionString: SOURCE_DB_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // 1. Fetch patients from source database
    const srcPatients = await srcPool.query(`SELECT * FROM patients`);

    const synced = [];

    for (const p of srcPatients.rows) {
      // Find or upsert patient in destination db by email
      const existing = await destPool.query(
        `SELECT id FROM patients WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))`,
        [p.email]
      );

      let targetPatientId: string;

      if (existing.rows.length > 0) {
        targetPatientId = existing.rows[0].id;
        await destPool.query(
          `UPDATE patients
           SET name = $1, profile_image = $2, phone = $3, dob = $4, gender = $5, updated_at = now()
           WHERE id = $6`,
          [p.name, p.profile_image, p.phone, p.dob, p.gender, targetPatientId]
        );
      } else {
        targetPatientId = p.id;
        await destPool.query(
          `INSERT INTO patients (id, name, email, password_hash, dob, gender, phone, role, profile_image, is_active, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT (email) DO UPDATE SET
             name = EXCLUDED.name,
             profile_image = EXCLUDED.profile_image,
             phone = EXCLUDED.phone,
             dob = EXCLUDED.dob,
             gender = EXCLUDED.gender,
             updated_at = now()`,
          [
            p.id,
            p.name,
            p.email,
            p.password_hash,
            p.dob,
            p.gender,
            p.phone,
            p.role || 'PATIENT',
            p.profile_image,
            p.is_active ?? true,
            p.created_at || new Date(),
            p.updated_at || new Date(),
          ]
        );
      }

      // Sync profile
      const srcProfile = await srcPool.query(
        `SELECT * FROM patient_profiles WHERE patient_id = $1`,
        [p.id]
      );

      if (srcProfile.rows.length > 0) {
        const prof = srcProfile.rows[0];
        await destPool.query(
          `INSERT INTO patient_profiles (
            patient_id, blood_group, height_cm, weight_kg, allergies, chronic_conditions,
            address_line1, address_line2, city, state, country, pincode,
            emergency_contact_name, emergency_contact_phone, emergency_contact_relation
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
          ON CONFLICT (patient_id) DO UPDATE SET
            blood_group = EXCLUDED.blood_group,
            height_cm = EXCLUDED.height_cm,
            weight_kg = EXCLUDED.weight_kg,
            allergies = EXCLUDED.allergies,
            chronic_conditions = EXCLUDED.chronic_conditions,
            address_line1 = EXCLUDED.address_line1,
            address_line2 = EXCLUDED.address_line2,
            city = EXCLUDED.city,
            state = EXCLUDED.state,
            country = EXCLUDED.country,
            pincode = EXCLUDED.pincode,
            emergency_contact_name = EXCLUDED.emergency_contact_name,
            emergency_contact_phone = EXCLUDED.emergency_contact_phone,
            emergency_contact_relation = EXCLUDED.emergency_contact_relation,
            updated_at = now()`,
          [
            targetPatientId,
            prof.blood_group,
            prof.height_cm,
            prof.weight_kg,
            prof.allergies,
            prof.chronic_conditions,
            prof.address_line1,
            prof.address_line2,
            prof.city,
            prof.state,
            prof.country,
            prof.pincode,
            prof.emergency_contact_name,
            prof.emergency_contact_phone,
            prof.emergency_contact_relation,
          ]
        );
      }

      // Sync documents
      const srcDocs = await srcPool.query(
        `SELECT * FROM patient_documents WHERE patient_id = $1`,
        [p.id]
      );

      for (const doc of srcDocs.rows) {
        const docExists = await destPool.query(
          `SELECT id FROM patient_documents WHERE patient_id = $1 AND file_name = $2`,
          [targetPatientId, doc.file_name]
        );

        if (docExists.rows.length === 0) {
          await destPool.query(
            `INSERT INTO patient_documents (id, patient_id, file_url, file_key, file_name, created_at)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              doc.id,
              targetPatientId,
              doc.file_url,
              doc.file_key,
              doc.file_name,
              doc.created_at || new Date(),
            ]
          );
        }
      }

      synced.push({
        email: p.email,
        name: p.name,
        profile_image: p.profile_image,
        documentsCount: srcDocs.rows.length,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Patient data synced successfully',
      synced,
    });
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync data' },
      { status: 500 }
    );
  } finally {
    await srcPool.end();
  }
}

export async function GET() {
  return POST();
}
