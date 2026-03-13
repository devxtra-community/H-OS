import { pool } from '../../db';
import { randomUUID } from 'crypto';

class AdmissionRepository {
  async createAdmission(data: {
    patientId: string;
    doctorId: string;
    departmentId: string;
  }) {
    const result = await pool.query(
      `
      INSERT INTO admissions
      (id, patient_id, doctor_id, department_id, status)
      VALUES ($1,$2,$3,$4,'REQUESTED')
      RETURNING *
      `,
      [randomUUID(), data.patientId, data.doctorId, data.departmentId]
    );

    return result.rows[0];
  }

  async getPendingAdmissions() {
    const result = await pool.query(
      `
      SELECT *
      FROM admissions
      WHERE status='REQUESTED'
      ORDER BY created_at ASC
      `
    );

    return result.rows;
  }

  async markAdmitted(id: string) {
    await pool.query(
      `
      UPDATE admissions
      SET status='ADMITTED',
          admitted_at = now()
      WHERE id=$1
      `,
      [id]
    );
  }
  async requestDischarge(id: string) {
    await pool.query(
      `
    UPDATE admissions
    SET discharge_requested = true,
        discharge_requested_at = now()
    WHERE id = $1
    `,
      [id]
    );
  }

  async completeDischarge(id: string) {
    await pool.query(
      `
    UPDATE admissions
    SET status = 'DISCHARGED',
        discharge_requested = false
    WHERE id = $1
    `,
      [id]
    );
  }

  async getDoctorAdmissions(doctorId: string) {
    const result = await pool.query(
      `
    SELECT
      id,
      patient_id,
      doctor_id,
      department_id,
      status,
      created_at
    FROM admissions
    WHERE doctor_id = $1
    AND status = 'ADMITTED'
    ORDER BY created_at DESC
    `,
      [doctorId]
    );

    return result.rows;
  }
  async getDischargeRequests() {
    const result = await pool.query(
      `
    SELECT
      id,
      patient_id,
      doctor_id
    FROM admissions
    WHERE discharge_requested = true
    AND status = 'ADMITTED'
    ORDER BY created_at ASC
    `
    );

    return result.rows;
  }
}

export const admissionRepository = new AdmissionRepository();
