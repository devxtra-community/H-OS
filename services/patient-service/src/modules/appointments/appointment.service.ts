import axios from 'axios';
import { pool } from '../../db';
import { appointmentRepository } from './appointment.repository';

export class AppointmentService {
  async validateDoctor(doctorId: string) {
    await axios.get(`${process.env.STAFF_SERVICE_URL}/staff/by-id/${doctorId}`);
  }

  async bookAppointment(data: {
    doctorId: string;
    patientId: string;
    appointmentTime: string;
    durationMinutes?: number;
  }) {
    try {
      await this.validateDoctor(data.doctorId);
    } catch {
      throw new Error('Doctor not found');
    }

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

    const diffMinutes = (appointmentDate.getTime() - start.getTime()) / 60000;

    if (diffMinutes % slot_duration !== 0) {
      throw new Error('INVALID_SLOT_TIME');
    }

    const appointment = await appointmentRepository.createAppointment({
      doctorId: data.doctorId,
      patientId: data.patientId,
      appointmentTime: new Date(data.appointmentTime),
      durationMinutes: slot_duration,
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
        const actualStart = new Date(appt.actual_start_time);

        const plannedEnd = new Date(
          actualStart.getTime() + appt.duration_minutes * 60000
        );

        const now = new Date();

        currentTime = now > plannedEnd ? now : plannedEnd;

        estimatedStart = actualStart;
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

    let doctorDelayMinutes = 0;

    if (queue.length > 0) {
      const firstPlanned = new Date(queue[0].planned_time);
      const firstEstimated = new Date(queue[0].estimated_start_time);

      doctorDelayMinutes = Math.max(
        0,
        Math.floor((firstEstimated.getTime() - firstPlanned.getTime()) / 60000)
      );
    }

    const nextAvailableTime =
      queue.length > 0 ? queue[queue.length - 1].estimated_end_time : null;

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

  async getPatientHistory(patientId: string) {
    const appointments =
      await appointmentRepository.getPatientHistory(patientId);

    const enriched = await Promise.all(
      appointments.map(async (appt) => {
        try {
          const response = await axios.get(
            `${process.env.STAFF_SERVICE_URL}/staff/by-id/${appt.doctor_id}`
          );

          const doctor = response.data;

          return {
            ...appt,
            doctor_name: doctor.name,
            department: doctor.department_id,
          };
        } catch {
          return {
            ...appt,
            doctor_name: 'Unknown',
            department: 'Unknown',
          };
        }
      })
    );

    return enriched;
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

    const booked = await appointmentRepository.getBookedSlots(doctorId, date);

    const available = slots.filter((slot) => !booked.includes(slot));

    return available;
  }
  async createEmergencyAppointment(doctorId: string, patientId: string) {
    try {
      await this.validateDoctor(doctorId);
    } catch {
      throw new Error('Doctor not found');
    }

    const now = new Date();
    const dayOfWeek = now.getDay();

    const availabilityResponse = await axios.get(
      `${process.env.STAFF_SERVICE_URL}/staff/availability/${doctorId}/${dayOfWeek}`
    );

    const availability = availabilityResponse.data;

    if (!availability) {
      throw new Error('DOCTOR_NOT_AVAILABLE');
    }

    const { slot_duration } = availability;

    const appointment = await appointmentRepository.createAppointment({
      doctorId,
      patientId,
      appointmentTime: now,
      durationMinutes: slot_duration,
      priority: 'HIGH',
    });

    if (!appointment) {
      throw new Error('SLOT_TAKEN');
    }

    await this.updateStatus(appointment.id, 'CHECKED_IN');

    return appointment;
  }
  async getMyStatus(patientId: string) {
    const today = new Date().toLocaleDateString('en-CA');

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

  async setPriority(appointmentId: string, priority: 'NORMAL' | 'HIGH') {
    const appointment =
      await appointmentRepository.getAppointmentById(appointmentId);

    if (!appointment) throw new Error('NOT_FOUND');

    return appointmentRepository.updatePriority(appointmentId, priority);
  }

  async cancelAppointment(appointmentId: string, patientId: string) {
    const appointment =
      await appointmentRepository.getAppointmentById(appointmentId);

    if (!appointment) throw new Error('NOT_FOUND');

    if (appointment.patient_id !== patientId) throw new Error('FORBIDDEN');

    if (appointment.status !== 'SCHEDULED') throw new Error('CANNOT_CANCEL');

    // Check if it's too late (e.g. less than 1 hour before)
    const now = new Date();
    const apptTime = new Date(appointment.appointment_time);
    const diffHours = (apptTime.getTime() - now.getTime()) / 3600000;

    if (diffHours < 1) throw new Error('TOO_LATE_TO_CANCEL');

    return this.updateStatus(appointmentId, 'CANCELLED');
  }

  async rescheduleAppointment(
    appointmentId: string,
    patientId: string,
    newTimeStr: string
  ) {
    const appointment =
      await appointmentRepository.getAppointmentById(appointmentId);

    if (!appointment) throw new Error('NOT_FOUND');

    if (appointment.patient_id !== patientId) throw new Error('FORBIDDEN');

    if (appointment.status !== 'SCHEDULED')
      throw new Error('CANNOT_RESCHEDULE');

    const now = new Date();
    const newTime = new Date(newTimeStr);

    if (newTime <= now) {
      throw new Error('PAST_TIME_NOT_ALLOWED');
    }

    // Check if too late to change current one
    const apptTime = new Date(appointment.appointment_time);
    const diffHours = (apptTime.getTime() - now.getTime()) / 3600000;

    if (diffHours < 1) throw new Error('TOO_LATE_TO_RESCHEDULE');

    // Validate new slot
    const dayOfWeek = newTime.getDay();
    const availabilityResponse = await axios.get(
      `${process.env.STAFF_SERVICE_URL}/staff/availability/${appointment.doctor_id}/${dayOfWeek}`
    );

    const availability = availabilityResponse.data;
    if (!availability) throw new Error('DOCTOR_NOT_AVAILABLE');

    const { start_time, end_time, slot_duration } = availability;

    const start = new Date(newTime);
    start.setHours(
      Number(start_time.split(':')[0]),
      Number(start_time.split(':')[1]),
      0,
      0
    );

    const end = new Date(newTime);
    end.setHours(
      Number(end_time.split(':')[0]),
      Number(end_time.split(':')[1]),
      0,
      0
    );

    if (newTime < start || newTime >= end) {
      throw new Error('OUTSIDE_WORKING_HOURS');
    }

    const diffMinutes = (newTime.getTime() - start.getTime()) / 60000;
    if (diffMinutes % slot_duration !== 0) {
      throw new Error('INVALID_SLOT_TIME');
    }

    // Check if slot taken
    const dateStr = newTime.toISOString().split('T')[0];
    const booked = await appointmentRepository.getBookedSlots(
      appointment.doctor_id,
      dateStr
    );

    const hours = newTime.getHours().toString().padStart(2, '0');
    const minutes = newTime.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    if (booked.includes(timeStr)) {
      throw new Error('SLOT_TAKEN');
    }

    return appointmentRepository.updateAppointmentTime(
      appointmentId,
      newTime,
      slot_duration
    );
  }
}

export const appointmentService = new AppointmentService();
