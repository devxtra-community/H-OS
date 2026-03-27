import { pool } from '../../db';
import { randomUUID } from 'crypto';

class AdmissionRepository {
  async createAdmission(data: {
    patientId: string;
    doctorId: string;
    departmentId: string;
  }) {
    const existing = await pool.query(
      `SELECT * FROM admissions WHERE patient_id = $1 AND status != 'DISCHARGED'`,
      [data.patientId]
    );
    if (existing.rows.length > 0) return existing.rows[0];

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
      SELECT a.*, p.name AS patient_name
      FROM admissions a
      LEFT JOIN patients p ON p.id = a.patient_id
      WHERE a.status='REQUESTED'
      ORDER BY a.created_at ASC
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
      a.id,
      a.patient_id,
      p.name AS patient_name,
      a.doctor_id,
      a.department_id,
      a.status,
      a.created_at,
      a.discharge_requested
    FROM admissions a
    LEFT JOIN patients p ON p.id = a.patient_id
    WHERE a.doctor_id = $1
    AND a.status = 'ADMITTED'
    ORDER BY a.created_at DESC
    `,
      [doctorId]
    );

    return result.rows;
  }
  async getDischargeRequests() {
    const result = await pool.query(
      `
    SELECT
      a.id,
      a.patient_id,
      p.name AS patient_name,
      a.doctor_id
    FROM admissions a
    LEFT JOIN patients p ON p.id = a.patient_id
    WHERE a.discharge_requested = true
    AND a.status = 'ADMITTED'
    ORDER BY a.created_at ASC
    `
    );

    return result.rows;
  }

  async getCurrentAdmission(patientId: string) {
    const result = await pool.query(
      `
      SELECT * FROM admissions 
      WHERE patient_id = $1 
      AND status != 'DISCHARGED'
      LIMIT 1
      `,
      [patientId]
    );

    return result.rows[0] || null;
  }

  async getAdmissionsByIds(ids: string[]) {
    if (!ids || ids.length === 0) return [];
    const result = await pool.query(
      `SELECT id, patient_id, doctor_id FROM admissions WHERE id = ANY($1::uuid[])`,
      [ids]
    );
    return result.rows;
  }

  async getBulkCurrent(patientIds: string[]) {
    if (!patientIds || patientIds.length === 0) return [];
    const result = await pool.query(
      `SELECT id as admission_id, patient_id, doctor_id 
       FROM admissions 
       WHERE patient_id = ANY($1::uuid[]) AND status != 'DISCHARGED'`,
      [patientIds]
    );
    return result.rows;
  }
}

export const admissionRepository = new AdmissionRepository();
