import { pool } from '../../db';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

class StaffService {
  async createStaff(data: {
    name: string;
    email: string;
    password: string;
    department_id: string;
    role: string;
    job_title: string;
  }) {
    /**
     * 1️⃣ Check if email already exists
     */
    const existing = await pool.query(`SELECT id FROM staff WHERE email = $1`, [
      data.email,
    ]);

    if (existing.rows.length > 0) {
      throw new Error('Staff already exists');
    }

    /**
     * 2️⃣ Validate department exists
     */
    const departmentCheck = await pool.query(
      `SELECT id FROM departments WHERE id = $1`,
      [data.department_id]
    );

    if (departmentCheck.rows.length === 0) {
      throw new Error('Invalid department');
    }

    /**
     * 3️⃣ Hash password
     */
    const passwordHash = await bcrypt.hash(data.password, 10);

    /**
     * 4️⃣ Insert staff
     */
    const insertResult = await pool.query(
      `
    INSERT INTO staff (
      id,
      name,
      email,
      password_hash,
      department_id,
      role,
      job_title,
      is_active
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,true)
    RETURNING id
    `,
      [
        randomUUID(),
        data.name,
        data.email,
        passwordHash,
        data.department_id,
        data.role,
        data.job_title,
      ]
    );

    const staffId = insertResult.rows[0].id;

    /**
     * 5️⃣ Return staff with department name (JOIN)
     */
    const fullStaff = await pool.query(
      `
    SELECT 
      s.id,
      s.name,
      s.email,
      s.role,
      s.job_title,
      d.id AS department_id,
      d.name AS department
    FROM staff s
    JOIN departments d ON s.department_id = d.id
    WHERE s.id = $1
    `,
      [staffId]
    );

    return fullStaff.rows[0];
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

  async upsertAvailability(data: {
    doctorId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDuration: number;
  }) {
    const result = await pool.query(
      `
    INSERT INTO doctor_availability
      (id, doctor_id, day_of_week, start_time, end_time, slot_duration)
    VALUES
      ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (doctor_id, day_of_week)
    DO UPDATE SET
      start_time = EXCLUDED.start_time,
      end_time = EXCLUDED.end_time,
      slot_duration = EXCLUDED.slot_duration
    RETURNING *;
    `,
      [
        randomUUID(),
        data.doctorId,
        data.dayOfWeek,
        data.startTime,
        data.endTime,
        data.slotDuration,
      ]
    );

    return result.rows[0];
  }
}

export const staffService = new StaffService();
