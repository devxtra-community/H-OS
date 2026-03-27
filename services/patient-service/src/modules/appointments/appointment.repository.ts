import { pool } from '../../db';
import { randomUUID } from 'crypto';

export class AppointmentRepository {
  async createAppointment(data: {
    doctorId: string;
    patientId: string;
    appointmentTime: Date;
    durationMinutes: number;
    priority: 'NORMAL' | 'HIGH';
  }) {
    try {
      const result = await pool.query(
        `
      INSERT INTO appointments (
        id,
        doctor_id,
        patient_id,
        appointment_time,
        duration_minutes,
        priority,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,'SCHEDULED')
      RETURNING *;
      `,
        [
          randomUUID(),
          data.doctorId,
          data.patientId,
          data.appointmentTime,
          data.durationMinutes,
          data.priority,
        ]
      );

      return result.rows[0];
    } catch (err: any) {
      if (err.code === '23505') {
        // unique violation
        return null;
      }

      throw err;
    }
  }

  async getDoctorAppointmentsForDay(
    doctorId: string,
    date: string,
    statuses: string[] = ['SCHEDULED', 'CHECKED_IN', 'IN_PROGRESS']
  ) {
    const result = await pool.query(
      `
    SELECT 
      a.*, 
      p.name AS patient_name,
      EXISTS (
        SELECT 1 FROM admissions adm 
        WHERE adm.patient_id = a.patient_id 
        AND adm.status != 'DISCHARGED'
      ) AS admission_requested
    FROM appointments a
    LEFT JOIN patients p ON p.id = a.patient_id
    WHERE a.doctor_id = $1
    AND a.appointment_time::date = $2
    AND a.status = ANY($3)
    ORDER BY
      CASE WHEN a.priority = 'HIGH' THEN 0 ELSE 1 END,
      a.appointment_time ASC
    `,
      [doctorId, date, statuses]
    );

    return result.rows;
  }

  async updatePriority(appointmentId: string, priority: 'NORMAL' | 'HIGH') {
    const result = await pool.query(
      `
    UPDATE appointments
    SET priority = $2,
        updated_at = now()
    WHERE id = $1
    RETURNING *;
    `,
      [appointmentId, priority]
    );

    return result.rows[0] || null;
  }

  async markNoShow(appointmentId: string) {
    const result = await pool.query(
      `
    UPDATE appointments
    SET status = 'NO_SHOW',
        updated_at = now()
    WHERE id = $1
    RETURNING *;
    `,
      [appointmentId]
    );

    return result.rows[0] || null;
  }

  async getPatientActiveAppointment(patientId: string, date: string) {
    const result = await pool.query(
      `
    SELECT *
    FROM appointments
    WHERE patient_id = $1
    AND appointment_time::date = $2
    AND status IN (
      'SCHEDULED',
      'CHECKED_IN',
      'IN_PROGRESS'
    )
    LIMIT 1
    `,
      [patientId, date]
    );

    return result.rows[0] || null;
  }

  async getPatientHistory(patientId: string) {
    const result = await pool.query(
      `
    SELECT *
    FROM appointments
    WHERE patient_id = $1
    ORDER BY appointment_time DESC
    `,
      [patientId]
    );

    return result.rows;
  }

  async getBookedSlots(doctorId: string, date: string) {
    const result = await pool.query(
      `
    SELECT appointment_time
    FROM appointments
    WHERE doctor_id = $1
    AND appointment_time::date = $2
    AND status NOT IN ('CANCELLED', 'NO_SHOW')
    `,
      [doctorId, date]
    );

    return result.rows.map((r) => {
      const d = new Date(r.appointment_time);
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    });
  }

  async updateAppointmentTime(
    appointmentId: string,
    newTime: Date,
    newDuration: number
  ) {
    const result = await pool.query(
      `
    UPDATE appointments
    SET appointment_time = $2,
        duration_minutes = $3,
        updated_at = now()
    WHERE id = $1
    RETURNING *;
    `,
      [appointmentId, newTime, newDuration]
    );

    return result.rows[0];
  }

  async getAppointmentById(id: string) {
    const result = await pool.query(
      `SELECT * FROM appointments WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }
}

export const appointmentRepository = new AppointmentRepository();
