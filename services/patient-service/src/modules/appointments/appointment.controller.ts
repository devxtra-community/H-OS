import { Request, Response } from 'express';
import { appointmentService } from './appointment.service';
import { error, log } from 'console';

export class AppointmentController {
  async book(req: Request, res: Response) {
    try {
      const { doctorId, appointmentTime, durationMinutes, priority } = req.body;

      if (!doctorId || !appointmentTime) {
        return res.status(400).json({
          error: 'doctorId and appointmentTime are required',
        });
      }

      const patientId = req.headers['x-user-id'] as string;

      if (!patientId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const appointment = await appointmentService.bookAppointment({
        doctorId,
        patientId,
        appointmentTime,
        durationMinutes,
      });

      return res.status(201).json(appointment);
    } catch (err: any) {
      if (err.message === 'SLOT_TAKEN') {
        return res.status(409).json({
          error: 'This slot is already booked',
        });
      }

      if (err.message === 'Doctor not found') {
        return res.status(404).json({
          error: 'Doctor not found',
        });
      }

      if (err.message === 'DOCTOR_NOT_AVAILABLE')
        return res.status(400).json({
          error: 'Doctor not available on this day',
        });

      if (err.message === 'OUTSIDE_WORKING_HOURS')
        return res.status(400).json({
          error: 'Outside working hours',
        });

      if (err.message === 'INVALID_SLOT_TIME')
        return res.status(400).json({
          error: 'Invalid slot time',
        });

      if (err.message === 'PAST_TIME_NOT_ALLOWED') {
        return res.status(400).json({ error: 'Cannot Book past time slot' });
      }

      return res.status(500).json({ error: 'Failed to book appointment' });
    }
  }

  async checkIn(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;

      if (!id) {
        return res.status(400).json({ error: 'Appointment ID is required' });
      }

      const updated = await appointmentService.updateStatus(id, 'CHECKED_IN');

      return res.json(updated);
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      if (err.message === 'INVALID_TRANSITION') {
        return res.status(400).json({ error: 'Invalid status transition' });
      }

      return res.status(500).json({ error: 'Check-in failed' });
    }
  }

  async start(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;

      if (!id) {
        return res.status(400).json({ error: 'Appointment ID is required' });
      }

      const updated = await appointmentService.updateStatus(id, 'IN_PROGRESS');

      return res.json(updated);
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      if (err.message === 'INVALID_TRANSITION') {
        return res.status(400).json({ error: 'Invalid status transition' });
      }

      return res.status(500).json({ error: 'Start failed' });
    }
  }

  async complete(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;

      if (!id) {
        return res.status(400).json({ error: 'Appointment ID is required' });
      }

      const updated = await appointmentService.updateStatus(id, 'COMPLETED');

      return res.json(updated);
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      if (err.message === 'INVALID_TRANSITION') {
        return res.status(400).json({ error: 'Invalid status transition' });
      }

      return res.status(500).json({ error: 'Complete failed' });
    }
  }

  async getDoctorQueue(req: Request, res: Response) {
    try {
      const doctorIdParam = req.params.doctorId;
      const doctorId = Array.isArray(doctorIdParam)
        ? doctorIdParam[0]
        : doctorIdParam;

      if (!doctorId) {
        return res.status(400).json({
          error: 'Doctor ID required',
        });
      }

      const date =
        (req.query.date as string) || new Date().toISOString().split('T')[0];

      const queue = await appointmentService.getDoctorQueueForDay(
        doctorId,
        date
      );

      return res.json(queue);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: 'Failed to fetch queue',
      });
    }
  }

  async setPriority(req: Request, res: Response) {
    try {
      const userType = req.headers['x-user-type'];

      if (userType !== 'STAFF') {
        return res.status(403).json({
          error: 'Only staff can change priority',
        });
      }

      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;

      if (!id) {
        return res.status(400).json({
          error: 'Appointment ID required',
        });
      }

      const { priority } = req.body;

      if (priority !== 'NORMAL' && priority !== 'HIGH') {
        return res.status(400).json({
          error: 'Invalid priority',
        });
      }

      const updated = await appointmentService.setPriority(id, priority);

      return res.json(updated);
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      return res.status(500).json({ error: 'Failed to update priority' });
    }
  }

  async myStatus(req: Request, res: Response) {
    try {
      const patientId = req.headers['x-user-id'] as string;
      const userType = req.headers['x-user-type'];

      if (!patientId || userType !== 'PATIENT') {
        return res.status(403).json({
          error: 'Only patients can access this',
        });
      }

      const status = await appointmentService.getMyStatus(patientId);

      if (!status) {
        return res.json({
          message: 'No active appointment today',
        });
      }

      return res.json(status);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch status' });
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;

      if (!id) {
        return res.status(400).json({
          error: 'Appointment ID is required',
        });
      }

      const patientId = req.headers['x-user-id'] as string;
      const userType = req.headers['x-user-type'];

      if (userType !== 'PATIENT') {
        return res.status(403).json({
          error: 'Only patients can cancel',
        });
      }

      const updated = await appointmentService.cancelAppointment(id, patientId);

      return res.json(updated);
    } catch (err: any) {
      if (err.message === 'NOT_FOUND')
        return res.status(404).json({ error: 'Not found' });

      if (err.message === 'FORBIDDEN')
        return res.status(403).json({ error: 'Forbidden' });

      if (err.message === 'CANNOT_CANCEL')
        return res.status(400).json({ error: 'Cannot cancel now' });

      if (err.message === 'TOO_LATE_TO_CANCEL')
        return res.status(400).json({
          error: 'Too late to cancel appointment',
        });

      return res.status(500).json({
        error: 'Cancel failed',
      });
    }
  }

  async history(req: Request, res: Response) {
    try {
      const patientId = req.headers['x-user-id'] as string;
      const userType = req.headers['x-user-type'];

      if (userType !== 'PATIENT') {
        return res.status(403).json({
          error: 'Only patients can view history',
        });
      }

      const history = await appointmentService.getPatientHistory(patientId);

      return res.json(history);
    } catch {
      return res.status(500).json({
        error: 'Failed to fetch history',
      });
    }
  }

  async reschedule(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;

      if (!id) {
        return res.status(400).json({
          error: 'Appointment ID required',
        });
      }

      const { newTime } = req.body;

      if (!newTime) {
        return res.status(400).json({
          error: 'newTime required',
        });
      }

      const patientId = req.headers['x-user-id'] as string;
      const userType = req.headers['x-user-type'];

      if (userType !== 'PATIENT') {
        return res.status(403).json({
          error: 'Only patients can reschedule',
        });
      }

      const updated = await appointmentService.rescheduleAppointment(
        id,
        patientId,
        newTime
      );

      return res.status(201).json(updated);
    } catch (err: any) {
      if (err.message === 'NOT_FOUND')
        return res.status(404).json({ error: 'Not found' });

      if (err.message === 'FORBIDDEN')
        return res.status(403).json({ error: 'Forbidden' });

      if (err.message === 'CANNOT_RESCHEDULE')
        return res.status(400).json({
          error: 'Cannot reschedule now',
        });

      if (err.message === 'TOO_LATE_TO_RESCHEDULE')
        return res.status(400).json({
          error: 'Too late to reschedule',
        });

      if (err.message === 'SLOT_TAKEN')
        return res.status(409).json({
          error: 'New slot already booked',
        });

      return res.status(500).json({
        error: 'Reschedule failed',
      });
    }
  }
  async availableSlots(req: Request, res: Response) {
    try {
      const { doctorId, date } = req.query;

      if (!doctorId || !date) {
        return res.status(400).json({
          error: 'doctorId and date required',
        });
      }

      const slots = await appointmentService.getAvailableSlots(
        doctorId as string,
        date as string
      );

      return res.json(slots);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: 'Failed to fetch slots',
      });
    }
  }
}

export const appointmentController = new AppointmentController();
