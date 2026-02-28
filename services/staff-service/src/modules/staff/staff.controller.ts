import { Request, Response } from 'express';
import { staffService } from './staff.service';
import { Pool } from 'pg';
import { pool } from '../../db';

function getIdParam(req: Request): string {
  const { id } = req.params;

  if (typeof id !== 'string') {
    throw new Error('Invalid staff id');
  }

  return id;
}

export class StaffController {
  async createStaff(req: Request, res: Response) {
    try {
      const staff = await staffService.createStaff(req.body);
      return res.status(201).json(staff);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async getStaffById(req: Request, res: Response) {
    try {
      const id = getIdParam(req);
      const staff = await staffService.getStaffById(id);

      if (!staff) {
        return res.status(404).json({ error: 'Staff not found' });
      }

      return res.json(staff);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async updateStaff(req: Request, res: Response) {
    try {
      const id = getIdParam(req);
      const staff = await staffService.updateStaff(id, req.body);
      return res.json(staff);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async deactivateStaff(req: Request, res: Response) {
    try {
      const id = getIdParam(req);
      await staffService.deactivateStaff(id);
      return res.status(204).send();
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async getAvailability(req: Request, res: Response) {
    try {
      const doctorIdParam = req.params.doctorId;
      const doctorId = Array.isArray(doctorIdParam)
        ? doctorIdParam[0]
        : doctorIdParam;

      const dayParam = req.params.dayOfWeek;
      const dayOfWeek = Number(
        Array.isArray(dayParam) ? dayParam[0] : dayParam
      );

      if (!doctorId || isNaN(dayOfWeek)) {
        return res.status(400).json({
          error: 'Invalid parameters',
        });
      }

      const availability = await staffService.getAvailability(
        doctorId,
        dayOfWeek
      );

      if (!availability) {
        return res.json(null);
      }

      return res.json(availability);
    } catch {
      return res.status(500).json({ error: 'Failed to fetch availability' });
    }
  }

  async setAvailability(req: Request, res: Response) {
    try {
      const { doctorId, dayOfWeek, startTime, endTime, slotDuration } =
        req.body;

      if (
        !doctorId ||
        typeof dayOfWeek !== 'number' ||
        !startTime ||
        !endTime
      ) {
        return res.status(400).json({
          error: 'Invalid parameters',
        });
      }

      const availability = await staffService.upsertAvailability({
        doctorId,
        dayOfWeek,
        startTime,
        endTime,
        slotDuration: slotDuration ?? 15,
      });

      return res.status(200).json(availability);
    } catch (err) {
      return res.status(500).json({
        error: 'Failed to save availability',
      });
    }
  }

  async getDepartments(req: Request, res: Response) {
    try {
      const result = await pool.query(
        `SELECT id, name FROM departments ORDER BY name`
      );
      res.json(result.rows);
    } catch {
      res.status(500).json({ error: 'Failed to fetch departments' });
    }
  }

  async getDoctorsByDepartment(req: Request, res: Response) {
    try {
      const departmentId = req.query.department_id as string;

      if (!departmentId) {
        return res.status(400).json({ error: 'department_id required' });
      }

      const result = await pool.query(
        `
      SELECT id, name, job_title
      FROM staff
      WHERE department_id = $1
      AND role = 'DOCTOR'
      AND is_active = true
      ORDER BY name
      `,
        [departmentId]
      );

      return res.json(result.rows);
    } catch {
      return res.status(500).json({ error: 'Failed to fetch doctors' });
    }
  }
}
