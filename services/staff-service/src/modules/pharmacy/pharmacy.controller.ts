import { Request, Response } from 'express';
import { pharmacyService } from './pharmacy.service';

export class PharmacyController {
  async createPrescription(req: Request, res: Response) {
    try {
      const doctorId = req.headers['x-user-id'] as string;
      const { patientId, patientName, items } = req.body;
      const result = await pharmacyService.createPrescription({
        patientId,
        patientName,
        doctorId,
        items,
      });
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async getPending(req: Request, res: Response) {
    try {
      const result = await pharmacyService.getPendingPrescriptions();
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  async dispense(req: Request, res: Response) {
    try {
      const staffId = req.headers['x-user-id'] as string;
      const { id } = req.params;
      const result = await pharmacyService.dispense(id, staffId);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }
}
