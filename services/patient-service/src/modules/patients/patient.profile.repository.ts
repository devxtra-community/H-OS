import { pool } from '../../db';

export async function getPatientProfile(patientId: string) {
  const result = await pool.query(
    `
    SELECT
      p.id,
      p.name,
      p.email,
      p.profile_image,
      p.dob,
      p.gender,
      p.phone,

      pr.blood_group,
      pr.height_cm,
      pr.weight_kg,
      pr.allergies,
      pr.chronic_conditions,
      pr.address_line1,
      pr.address_line2,
      pr.city,
      pr.state,
      pr.country,
      pr.pincode,
      pr.emergency_contact_name,
      pr.emergency_contact_phone,
      pr.emergency_contact_relation

    FROM patients p

    LEFT JOIN patient_profiles pr
      ON p.id = pr.patient_id

    WHERE p.id = $1
    `,
    [patientId]
  );

  return result.rows[0];
}

export async function upsertPatientProfile(patientId: string, data: any) {
  const result = await pool.query(
    `
    INSERT INTO patient_profiles (
      patient_id,
      blood_group,
      height_cm,
      weight_kg,
      allergies,
      chronic_conditions,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pincode,
      emergency_contact_name,
      emergency_contact_phone,
      emergency_contact_relation
    )

    VALUES (
      $1,$2,$3,$4,$5,$6,
      $7,$8,$9,$10,$11,$12,
      $13,$14,$15
    )

    ON CONFLICT (patient_id)

    DO UPDATE SET
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
      updated_at = now()

    RETURNING *
    `,
    [
      patientId,
      data.blood_group || null,
      data.height_cm ? Number(data.height_cm) : null,
      data.weight_kg ? Number(data.weight_kg) : null,
      data.allergies || null,
      data.chronic_conditions || null,
      data.address_line1 || null,
      data.address_line2 || null,
      data.city || null,
      data.state || null,
      data.country || null,
      data.pincode || null,
      data.emergency_contact_name || null,
      data.emergency_contact_phone || null,
      data.emergency_contact_relation || null,
    ]
  );

  return result.rows[0];
}

export async function updatePatientProfileImage(
  patientId: string,
  imageUrl: string
) {
  const result = await pool.query(
    `
    UPDATE patients
    SET profile_image = $2,
        updated_at = now()
    WHERE id = $1
    RETURNING profile_image
    `,
    [patientId, imageUrl]
  );

  return result.rows[0];
}
