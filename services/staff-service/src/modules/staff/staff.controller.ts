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
}
