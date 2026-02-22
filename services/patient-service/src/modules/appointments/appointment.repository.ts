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
      ON CONFLICT (doctor_id, appointment_time)
      DO NOTHING
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

    return result.rows[0] || null;
  }

  async getDoctorAppointmentsForDay(doctorId: string, date: string) {
    const result = await pool.query(
      `
      SELECT *
      FROM appointments
      WHERE doctor_id = $1
      AND appointment_time::date = $2
      AND status != 'CANCELLED'
      ORDER BY
        CASE WHEN priority = 'HIGH' THEN 0 ELSE 1 END,
        appointment_time ASC
      `,
      [doctorId, date]
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

    return result.rows.map((r) => new Date(r.appointment_time).toISOString());
  }
}

export const appointmentRepository = new AppointmentRepository();
