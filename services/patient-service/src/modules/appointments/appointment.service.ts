import axios from 'axios';
import { pool } from '../../db';
import { appointmentRepository } from './appointment.repository';
import { error } from 'console';

export class AppointmentService {
  async bookAppointment(data: {
    doctorId: string;
    patientId: string;
    appointmentTime: string;
    durationMinutes?: number;
  }) {
    // Validate doctor exists
    try {
      await axios.get(
        `${process.env.STAFF_SERVICE_URL}/staff/${data.doctorId}`
      );
    } catch {
      throw new Error('Doctor not found');
    }

    // 2️⃣ Validate booking is inside availability

    const appointmentDate = new Date(data.appointmentTime);

    const now = new Date();

    if (appointmentDate <= now) {
      throw new Error('PAST_TIME_NOT_ALLOWED');
    }
    const dayOfWeek = appointmentDate.getDay();

    const availabilityResponse = await axios.get(
      `${process.env.STAFF_SERVICE_URL}/staff/availability/${data.doctorId}/${dayOfWeek}`
    );

    const availability = availabilityResponse.data;

    if (!availability) {
      throw new Error('DOCTOR_NOT_AVAILABLE');
    }

    const { start_time, end_time, slot_duration } = availability;

    const start = new Date(appointmentDate);
    start.setHours(
      Number(start_time.split(':')[0]),
      Number(start_time.split(':')[1]),
      0,
      0
    );

    const end = new Date(appointmentDate);
    end.setHours(
      Number(end_time.split(':')[0]),
      Number(end_time.split(':')[1]),
      0,
      0
    );

    if (appointmentDate < start || appointmentDate >= end) {
      throw new Error('OUTSIDE_WORKING_HOURS');
    }

    // validate slot alignment
    const diffMinutes = (appointmentDate.getTime() - start.getTime()) / 60000;

    if (diffMinutes % slot_duration !== 0) {
      throw new Error('INVALID_SLOT_TIME');
    }

    const appointment = await appointmentRepository.createAppointment({
      doctorId: data.doctorId,
      patientId: data.patientId,
      appointmentTime: new Date(data.appointmentTime),
      durationMinutes: data.durationMinutes ?? 15,
      priority: 'NORMAL',
    });

    if (!appointment) {
      throw new Error('SLOT_TAKEN');
    }

    return appointment;
  }

  async updateStatus(appointmentId: string, newStatus: string) {
    const result = await pool.query(
      `SELECT * FROM appointments WHERE id = $1`,
      [appointmentId]
    );

    const appointment = result.rows[0];

    if (!appointment) {
      throw new Error('NOT_FOUND');
    }

    const allowedTransitions: Record<string, string[]> = {
      SCHEDULED: ['CHECKED_IN', 'CANCELLED', 'NO_SHOW'],
      CHECKED_IN: ['IN_PROGRESS'],
      IN_PROGRESS: ['COMPLETED'],
    };

    if (!allowedTransitions[appointment.status]?.includes(newStatus)) {
      throw new Error('INVALID_TRANSITION');
    }

    const updateQuery = `
      UPDATE appointments
      SET status = $2,
          ${newStatus === 'CHECKED_IN' ? 'check_in_time = now(),' : ''}
          ${newStatus === 'IN_PROGRESS' ? 'actual_start_time = now(),' : ''}
          ${newStatus === 'COMPLETED' ? 'actual_end_time = now(),' : ''}
          updated_at = now()
      WHERE id = $1
      RETURNING *;
    `;

    const updated = await pool.query(updateQuery, [appointmentId, newStatus]);

    return updated.rows[0];
  }

  async getDoctorQueueForDay(doctorId: string, date: string) {
    const appointments =
      await appointmentRepository.getDoctorAppointmentsForDay(doctorId, date);

    const GRACE_MINUTES = 10;
    const now = new Date();

    for (const appt of appointments) {
      if (appt.status === 'SCHEDULED') {
        const planned = new Date(appt.appointment_time);
        const graceTime = new Date(planned.getTime() + GRACE_MINUTES * 60000);

        if (now > graceTime) {
          await appointmentRepository.markNoShow(appt.id);
          appt.status = 'NO_SHOW';
        }
      }
    }

    let currentTime: Date | null = null;

    const queue = appointments.map((appt, index) => {
      let estimatedStart: Date;

      if (
        appt.status === 'COMPLETED' &&
        appt.actual_start_time &&
        appt.actual_end_time
      ) {
        estimatedStart = new Date(appt.actual_start_time);
        currentTime = new Date(appt.actual_end_time);
      } else if (appt.status === 'IN_PROGRESS' && appt.actual_start_time) {
        estimatedStart = new Date(appt.actual_start_time);
        currentTime = new Date(
          estimatedStart.getTime() + appt.duration_minutes * 60000
        );
      } else {
        const planned = new Date(appt.appointment_time);

        if (!currentTime || planned > currentTime) {
          estimatedStart = planned;
        } else {
          estimatedStart = currentTime;
        }

        currentTime = new Date(
          estimatedStart.getTime() + appt.duration_minutes * 60000
        );
      }

      const estimatedEnd = new Date(
        estimatedStart.getTime() + appt.duration_minutes * 60000
      );

      const delayMinutes =
        estimatedStart.getTime() - new Date(appt.appointment_time).getTime();

      return {
        id: appt.id,
        patient_id: appt.patient_id,
        status: appt.status,
        priority: appt.priority,
        planned_time: appt.appointment_time,
        estimated_start_time: estimatedStart,
        estimated_end_time: estimatedEnd,
        delay_minutes: Math.max(0, Math.floor(delayMinutes / 60000)),
        position: index + 1,
        patients_ahead: index,
        is_current: appt.status === 'IN_PROGRESS',
      };
    });

    // 🧠 Doctor Delay Calculation

    let doctorDelayMinutes = 0;

    if (queue.length > 0) {
      const firstPlanned = new Date(queue[0].planned_time);
      const firstEstimated = new Date(queue[0].estimated_start_time);

      doctorDelayMinutes = Math.max(
        0,
        Math.floor((firstEstimated.getTime() - firstPlanned.getTime()) / 60000)
      );
    }

    // 🧠 Next Available Time
    const nextAvailableTime =
      queue.length > 0 ? queue[queue.length - 1].estimated_end_time : null;

    // 🧠 Remaining Queue Minutes (from now)
    let remainingQueueMinutes = 0;

    if (nextAvailableTime) {
      remainingQueueMinutes = Math.max(
        0,
        Math.floor((new Date(nextAvailableTime).getTime() - Date.now()) / 60000)
      );
    }

    return {
      queue,
      doctor_status: {
        current_patient: queue.find((q) => q.is_current)?.id || null,
        total_appointments: queue.length,
        checked_in_count: queue.filter((q) => q.status === 'CHECKED_IN').length,
        doctor_delay_minutes: doctorDelayMinutes,
        next_available_time: nextAvailableTime,
        remaining_queue_minutes: remainingQueueMinutes,
      },
    };
  }

  async setPriority(appointmentId: string, priority: 'NORMAL' | 'HIGH') {
    const appointment = await appointmentRepository.updatePriority(
      appointmentId,
      priority
    );

    if (!appointment) {
      throw new Error('NOT_FOUND');
    }

    return appointment;
  }

  async getMyStatus(patientId: string) {
    const today = new Date().toISOString().split('T')[0];

    const myAppointment =
      await appointmentRepository.getPatientActiveAppointment(patientId, today);

    if (!myAppointment) {
      return null;
    }

    // get full doctor queue
    const doctorQueue = await this.getDoctorQueueForDay(
      myAppointment.doctor_id,
      today
    );

    const myQueueItem = doctorQueue.queue.find(
      (q) => q.id === myAppointment.id
    );

    if (!myQueueItem) {
      return null;
    }

    return {
      appointment_id: myAppointment.id,
      doctor_id: myAppointment.doctor_id,
      status: myQueueItem.status,
      position: myQueueItem.position,
      patients_ahead: myQueueItem.patients_ahead,
      estimated_start_time: myQueueItem.estimated_start_time,
      estimated_end_time: myQueueItem.estimated_end_time,
      delay_minutes: myQueueItem.delay_minutes,
      doctor_delay_minutes: doctorQueue.doctor_status.doctor_delay_minutes,
      doctor_current_patient: doctorQueue.doctor_status.current_patient,
    };
  }

  async cancelAppointment(appointmentId: string, patientId: string) {
    const result = await pool.query(
      `SELECT * FROM appointments WHERE id = $1`,
      [appointmentId]
    );

    const appt = result.rows[0];

    if (!appt) {
      throw new Error('NOT_FOUND');
    }

    if (appt.patient_id !== patientId) {
      throw new Error('FORBIDDEN');
    }

    if (appt.status !== 'SCHEDULED') {
      throw new Error('CANNOT_CANCEL');
    }

    const now = new Date();
    const appointmentTime = new Date(appt.appointment_time);

    const diffMinutes = (appointmentTime.getTime() - now.getTime()) / 60000;

    if (diffMinutes < 60) {
      throw new Error('TOO_LATE_TO_CANCEL');
    }

    const updated = await pool.query(
      `
    UPDATE appointments
    SET status = 'CANCELLED',
        updated_at = now()
    WHERE id = $1
    RETURNING *
    `,
      [appointmentId]
    );

    return updated.rows[0];
  }

  async getPatientHistory(patientId: string) {
    return appointmentRepository.getPatientHistory(patientId);
  }

  async rescheduleAppointment(
    appointmentId: string,
    patientId: string,
    newTime: string
  ) {
    const result = await pool.query(
      `SELECT * FROM appointments WHERE id = $1`,
      [appointmentId]
    );

    const appt = result.rows[0];

    if (!appt) {
      throw new Error('NOT_FOUND');
    }

    if (appt.patient_id !== patientId) {
      throw new Error('FORBIDDEN');
    }

    if (appt.status !== 'SCHEDULED') {
      throw new Error('CANNOT_RESCHEDULE');
    }

    const now = new Date();
    const oldTime = new Date(appt.appointment_time);

    const diffMinutes = (oldTime.getTime() - now.getTime()) / 60000;

    if (diffMinutes < 60) {
      throw new Error('TOO_LATE_TO_RESCHEDULE');
    }

    // 1️⃣ Cancel old
    await pool.query(
      `
    UPDATE appointments
    SET status = 'CANCELLED',
        updated_at = now()
    WHERE id = $1
    `,
      [appointmentId]
    );

    // 2️⃣ Create new appointment
    const newAppointment = await appointmentRepository.createAppointment({
      doctorId: appt.doctor_id,
      patientId,
      appointmentTime: new Date(newTime),
      durationMinutes: appt.duration_minutes,
      priority: 'NORMAL',
    });

    if (!newAppointment) {
      throw new Error('SLOT_TAKEN');
    }

    return newAppointment;
  }

  async getAvailableSlots(doctorId: string, date: string) {
    const dayOfWeek = new Date(date).getDay();

    const availabilityResponse = await axios.get(
      `${process.env.STAFF_SERVICE_URL}/staff/availability/${doctorId}/${dayOfWeek}`
    );

    const availability = availabilityResponse.data;

    if (!availability) {
      return [];
    }

    const { start_time, end_time, slot_duration } = availability;

    // Generate slots
    const slots: string[] = [];

    const start = new Date(`${date}T${start_time}`);
    const end = new Date(`${date}T${end_time}`);

    let current = new Date(start);

    while (current < end) {
      const hours = current.getHours().toString().padStart(2, '0');
      const minutes = current.getMinutes().toString().padStart(2, '0');

      slots.push(`${hours}:${minutes}`);

      current = new Date(current.getTime() + slot_duration * 60000);
    }

    // Remove booked slots
    const booked = await appointmentRepository.getBookedSlots(doctorId, date);

    const available = slots.filter((slot) => !booked.includes(slot));

    return available;
  }
}

export const appointmentService = new AppointmentService();
