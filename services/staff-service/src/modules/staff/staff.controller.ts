import { Request, Response } from 'express';
import { staffService } from './staff.service';

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
}
