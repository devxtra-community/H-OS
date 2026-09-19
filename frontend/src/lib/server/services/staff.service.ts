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

export class StaffService {
  async loginStaff(email: string, password: string) {
    const result = await pool.query(
      `
      SELECT 
        s.id, s.name, s.email, s.password_hash, s.role, s.job_title,
        d.id AS department_id, d.name AS department
      FROM staff s
      JOIN departments d ON s.department_id = d.id
      WHERE s.email = $1
      `,
      [email]
    );

    const staff = result.rows[0];
    if (!staff) throw new Error('Invalid credentials');

    const ok = await bcrypt.compare(password, staff.password_hash);
    if (!ok) throw new Error('Invalid credentials');

    const accessToken = jwt.sign(
      {
        sub: staff.id,
        type: 'STAFF',
        role: staff.role,
        job_title: staff.job_title,
        department_id: staff.department_id,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { sub: staff.id, type: 'REFRESH' },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    await pool.query(
      `INSERT INTO staff_refresh_tokens (id, staff_id, token_hash, expires_at) VALUES ($1, $2, $3, now() + interval '7 days')`,
      [randomUUID(), staff.id, hashToken(refreshToken)]
    );

    return {
      accessToken,
      refreshToken,
      staff: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        job_title: staff.job_title,
        department: staff.department,
        department_id: staff.department_id,
      },
    };
  }

  async getStaffById(id: string) {
    const result = await pool.query(
      `
      SELECT s.id, s.name, s.email, s.role, s.job_title, d.id AS department_id, d.name AS department
      FROM staff s
      JOIN departments d ON s.department_id = d.id
      WHERE s.id = $1
      `,
      [id]
    );
    return result.rows[0] || null;
  }

  async getDoctors() {
    const result = await pool.query(
      `
      SELECT s.id, s.name, s.email, d.name as department
      FROM staff s
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE s.role = 'DOCTOR' AND s.is_active = true
      ORDER BY s.name ASC
      `
    );
    return result.rows;
  }

  async getDepartments() {
    const result = await pool.query(
      `SELECT id, name FROM departments ORDER BY name ASC`
    );
    return result.rows;
  }
}

export const staffService = new StaffService();
