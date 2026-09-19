import { pool } from '../db';
import crypto, { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export class PatientService {
  async registerPatient(data: any) {
    const existing = await pool.query(
      `SELECT id FROM patients WHERE email = $1`,
      [data.email]
    );

    if (existing.rows.length > 0) {
      throw new Error('Patient already exists');
    }

    const id = randomUUID();
    const passwordHash = await bcrypt.hash(String(data.password).trim(), 10);

    const result = await pool.query(
      `
      INSERT INTO patients
        (id, email, password_hash, name, dob, gender, phone, role, is_active)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, 'PATIENT', true)
      RETURNING id, email, role
      `,
      [
        id,
        data.email,
        passwordHash,
        data.name,
        data.dob,
        data.gender,
        data.phone ?? null,
      ]
    );

    return result.rows[0];
  }

  async loginPatient(email: string, password: string) {
    const result = await pool.query(
      `
      SELECT id, name, email, password_hash, role
      FROM patients
      WHERE email = $1 AND is_active = true
      LIMIT 1
      `,
      [email]
    );

    const patient = result.rows[0];
    if (!patient) throw new Error('Invalid credentials');

    const passwordOk = await bcrypt.compare(
      String(password).trim(),
      patient.password_hash
    );

    if (!passwordOk) throw new Error('Invalid credentials');

    await pool.query(
      `UPDATE patient_refresh_tokens SET revoked = true WHERE patient_id = $1`,
      [patient.id]
    );

    const accessToken = jwt.sign(
      { sub: patient.id, role: patient.role, type: 'PATIENT' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { sub: patient.id, type: 'REFRESH' },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    await pool.query(
      `
      INSERT INTO patient_refresh_tokens
        (id, patient_id, token_hash, expires_at, revoked)
      VALUES
        ($1, $2, $3, now() + interval '7 days', false)
      `,
      [randomUUID(), patient.id, hashToken(refreshToken)]
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        role: patient.role,
      },
    };
  }

  async refreshTokens(refreshToken: string) {
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as {
      sub: string;
      type: string;
    };

    if (payload.type !== 'REFRESH') throw new Error('Invalid token type');

    const tokenHash = hashToken(refreshToken);
    const result = await pool.query(
      `SELECT id, patient_id, revoked, expires_at FROM patient_refresh_tokens WHERE token_hash = $1`,
      [tokenHash]
    );

    const stored = result.rows[0];
    if (
      !stored ||
      stored.revoked ||
      new Date(stored.expires_at).getTime() < Date.now()
    ) {
      throw new Error('Invalid refresh token');
    }

    await pool.query(
      `UPDATE patient_refresh_tokens SET revoked = true WHERE id = $1`,
      [stored.id]
    );

    const newAccessToken = jwt.sign(
      { sub: stored.patient_id, role: 'PATIENT', type: 'PATIENT' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const newRefreshToken = jwt.sign(
      { sub: stored.patient_id, type: 'REFRESH' },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    await pool.query(
      `INSERT INTO patient_refresh_tokens (id, patient_id, token_hash, expires_at) VALUES ($1, $2, $3, now() + interval '7 days')`,
      [randomUUID(), stored.patient_id, hashToken(newRefreshToken)]
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      userId: stored.patient_id,
    };
  }

  async getPatientById(id: string) {
    const result = await pool.query(
      `SELECT * FROM patients WHERE id = $1 AND is_active = true`,
      [id]
    );
    return result.rows[0] || null;
  }

  async getPatientsByIds(ids: string[]) {
    if (!ids || ids.length === 0) return [];
    const result = await pool.query(
      `SELECT id, name FROM patients WHERE id = ANY($1::uuid[])`,
      [ids]
    );
    return result.rows;
  }

  async getPatientProfile(patientId: string) {
    const result = await pool.query(
      `
      SELECT
        p.id, p.name, p.email, p.profile_image, p.dob, p.gender, p.phone,
        pr.blood_group, pr.height_cm, pr.weight_kg, pr.allergies, pr.chronic_conditions,
        pr.address_line1, pr.address_line2, pr.city, pr.state, pr.country, pr.pincode,
        pr.emergency_contact_name, pr.emergency_contact_phone, pr.emergency_contact_relation
      FROM patients p
      LEFT JOIN patient_profiles pr ON p.id = pr.patient_id
      WHERE p.id = $1
      `,
      [patientId]
    );
    return result.rows[0];
  }

  async upsertPatientProfile(patientId: string, data: any) {
    const result = await pool.query(
      `
      INSERT INTO patient_profiles (
        patient_id, blood_group, height_cm, weight_kg, allergies, chronic_conditions,
        address_line1, address_line2, city, state, country, pincode,
        emergency_contact_name, emergency_contact_phone, emergency_contact_relation
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      ON CONFLICT (patient_id) DO UPDATE SET
        blood_group = EXCLUDED.blood_group, height_cm = EXCLUDED.height_cm,
        weight_kg = EXCLUDED.weight_kg, allergies = EXCLUDED.allergies,
        chronic_conditions = EXCLUDED.chronic_conditions, address_line1 = EXCLUDED.address_line1,
        address_line2 = EXCLUDED.address_line2, city = EXCLUDED.city, state = EXCLUDED.state,
        country = EXCLUDED.country, pincode = EXCLUDED.pincode,
        emergency_contact_name = EXCLUDED.emergency_contact_name, emergency_contact_phone = EXCLUDED.emergency_contact_phone,
        emergency_contact_relation = EXCLUDED.emergency_contact_relation, updated_at = now()
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

  async updateProfileImage(patientId: string, imageUrl: string) {
    const result = await pool.query(
      `UPDATE patients SET profile_image = $2, updated_at = now() WHERE id = $1 RETURNING profile_image`,
      [patientId, imageUrl]
    );
    return result.rows[0];
  }

  async savePatientDocument(
    patientId: string,
    fileUrl: string,
    fileKey: string,
    fileName: string
  ) {
    const result = await pool.query(
      `INSERT INTO patient_documents (patient_id, file_url, file_key, file_name) VALUES ($1,$2,$3,$4) RETURNING *`,
      [patientId, fileUrl, fileKey, fileName]
    );
    return result.rows[0];
  }

  async getPatientDocuments(patientId: string) {
    const result = await pool.query(
      `SELECT file_url, file_key, file_name FROM patient_documents WHERE patient_id=$1 ORDER BY created_at DESC`,
      [patientId]
    );
    return result.rows;
  }
}

export const patientService = new PatientService();
