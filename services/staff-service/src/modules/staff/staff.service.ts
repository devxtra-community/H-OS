import { pool } from '../../db';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

class StaffService {
  async createStaff(data: any) {
    const existing = await pool.query(`SELECT id FROM staff WHERE email = $1`, [
      data.email,
    ]);

    if (existing.rows.length > 0) {
      throw new Error('Staff already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const result = await pool.query(
      `
      INSERT INTO staff (
        id,
        name,
        email,
        password_hash,
        department,
        role,
        job_title,
        is_active
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, true
      )
      RETURNING id, name, email, department, role, job_title
      `,
      [
        randomUUID(),
        data.name,
        data.email,
        passwordHash,
        data.department,
        data.role,
        data.job_title,
      ]
    );

    return result.rows[0];
  }

  async getStaffById(id: string) {
    const result = await pool.query(
      `
      SELECT id, name, email, department, role, job_title, is_active
      FROM staff
      WHERE id = $1
      `,
      [id]
    );

    return result.rows[0] || null;
  }

  async updateStaff(id: string, data: any) {
    const result = await pool.query(
      `
      UPDATE staff
      SET
        name = COALESCE($2, name),
        department = COALESCE($3, department),
        role = COALESCE($4, role),
        job_title = COALESCE($5, job_title),
        updated_at = now()
      WHERE id = $1
      RETURNING id, name, email, department, role, job_title
      `,
      [id, data.name, data.department, data.role, data.job_title]
    );

    return result.rows[0];
  }

  async deactivateStaff(id: string) {
    await pool.query(`UPDATE staff SET is_active = false WHERE id = $1`, [id]);
  }

  async getAvailability(doctorId: string, dayOfWeek: number) {
    const result = await pool.query(
      `
    SELECT *
    FROM doctor_availability
    WHERE doctor_id = $1
    AND day_of_week = $2
    LIMIT 1
    `,
      [doctorId, dayOfWeek]
    );

    return result.rows[0] || null;
  }
}

export const staffService = new StaffService();
