import { Request, Response } from 'express';
import { pharmacyService } from './pharmacy.service';

export class PharmacyController {
  async createPrescription(req: Request, res: Response) {
    try {
      const doctorId = String(req.headers['x-user-id']);
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
      const staffId = String(req.headers['x-user-id']);
      const id = String(req.params.id);
      const result = await pharmacyService.dispense(id, staffId);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }
}
