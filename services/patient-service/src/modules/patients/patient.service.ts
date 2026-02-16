import { pool } from '../../db';
import crypto from 'crypto';
import { CreatePatientDTO, UpdatePatientDTO } from './patient.types';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

console.log('🔥 REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET);

/**
 * ---- JWT CONFIG (typed to avoid TS overload issues)
 */
const ACCESS_TOKEN_EXPIRES_IN = process.env
  .ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'];

const REFRESH_TOKEN_EXPIRES_IN = process.env
  .REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'];

/**
 * ---- HELPERS
 */
function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

class PatientService {
  /**
   * REGISTER PATIENT
   */
  async registerPatient(data: CreatePatientDTO) {
    const existing = await pool.query(
      `SELECT id FROM patients WHERE email = $1`,
      [data.email]
    );

    if (existing.rows.length > 0) {
      throw new Error('Patient already exists');
    }

    const id = randomUUID();
    console.log('Raw pass : ', data.password);

    const passwordHash = await bcrypt.hash(String(data.password).trim(), 10);

    console.log('hashed pass : ', passwordHash);
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

  /**
   * LOGIN PATIENT
   */
  async loginPatient(email: string, password: string) {
    const result = await pool.query(
      `
      SELECT id, email, password_hash, role
      FROM patients
      WHERE email = $1 AND is_active = true
      LIMIT 1
      `,
      [email]
    );

    const patient = result.rows[0];
    if (!patient) throw new Error('Invalid credentials');

    console.log('Login email : ', email);
    console.log('raw pass :', password);
    console.log('db hashed pass : ', patient.password_hash);
    const passwordOk = await bcrypt.compare(
      String(password).trim(),
      patient.password_hash
    );

    console.log('bcrypt match :', passwordOk);

    if (!passwordOk) throw new Error('Invalid credentials');

    console.log('bcrypt passed');
    /**
     * 🔐 ACCESS TOKEN
     */
    const accessToken = jwt.sign(
      {
        sub: patient.id,
        role: patient.role,
        type: 'PATIENT',
      },
      process.env.JWT_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    console.log('access token created');
    /**
     * 🔁 REFRESH TOKEN
     */
    const refreshToken = jwt.sign(
      {
        sub: patient.id,
        type: 'REFRESH',
      },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    console.log('refresh token created');

    /**
     * 💾 STORE HASHED REFRESH TOKEN
     */
    await pool.query(
      `
      INSERT INTO patient_refresh_tokens
        (id, patient_id, token_hash, expires_at)
      VALUES
        ($1, $2, $3, now() + interval '7 days')
      `,
      [randomUUID(), patient.id, hashToken(refreshToken)]
    );

    console.log('refresh token saved');

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

  /**
   * REFRESH TOKENS (ROTATION ENABLED)
   */
  async refreshTokens(refreshToken: string) {
    console.log('🔁 refreshTokens called');
    console.log('🔁 Incoming refreshToken:', refreshToken);

    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as { sub: string; type: string };

      if (payload.type !== 'REFRESH') {
        console.log('❌ Token type mismatch');
        throw new Error('Invalid token type');
      }

      const tokenHash = hashToken(refreshToken);

      const result = await pool.query(
        `
      SELECT id, patient_id, revoked, expires_at
      FROM patient_refresh_tokens
      WHERE token_hash = $1
      `,
        [tokenHash]
      );

      const stored = result.rows[0];

      if (!stored) {
        console.log('❌ No token found in DB');
        throw new Error('Refresh token not found');
      }

      console.log('🔁 Stored token row:', stored);

      if (stored.revoked) {
        console.log('❌ Token is revoked');
        throw new Error('Refresh token revoked');
      }

      const expiresAt = new Date(stored.expires_at);
      console.log('🔁 Expires at:', expiresAt);
      console.log('🔁 Now:', new Date());

      if (expiresAt.getTime() < Date.now()) {
        console.log('❌ Token expired');
        throw new Error('Refresh token expired');
      }

      console.log('✅ Refresh token valid, rotating');

      await pool.query(
        `UPDATE patient_refresh_tokens SET revoked = true WHERE id = $1`,
        [stored.id]
      );

      const newAccessToken = jwt.sign(
        {
          sub: stored.patient_id,
          role: 'PATIENT',
          type: 'PATIENT',
        },
        process.env.JWT_SECRET!,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );

      const newRefreshToken = jwt.sign(
        {
          sub: stored.patient_id,
          type: 'REFRESH',
        },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
      );

      await pool.query(
        `
      INSERT INTO patient_refresh_tokens
        (id, patient_id, token_hash, expires_at)
      VALUES
        ($1, $2, $3, now() + interval '7 days')
      `,
        [randomUUID(), stored.patient_id, hashToken(newRefreshToken)]
      );

      console.log('✅ New tokens issued');

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        userId: stored.patient_id,
      };
    } catch (err) {
      console.log('❌ Refresh error:', err);
      throw err;
    }
  }

  /**
   * GET PATIENT PROFILE
   */
  async getPatientById(id: string) {
    const result = await pool.query(
      `SELECT * FROM patients WHERE id = $1 AND is_active = true`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * UPDATE PATIENT PROFILE
   */
  async updatePatient(id: string, data: UpdatePatientDTO) {
    const result = await pool.query(
      `
      UPDATE patients
      SET name = COALESCE($2, name),
          phone = COALESCE($3, phone),
          updated_at = now()
      WHERE id = $1
      RETURNING *
      `,
      [id, data.name, data.phone]
    );
    return result.rows[0];
  }

  /**
   * SOFT DELETE PATIENT
   */
  async deactivatePatient(id: string) {
    await pool.query(`UPDATE patients SET is_active = false WHERE id = $1`, [
      id,
    ]);
  }
}

export const patientService = new PatientService();
