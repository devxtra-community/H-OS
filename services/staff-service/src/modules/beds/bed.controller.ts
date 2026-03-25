import { Request, Response } from 'express';
import { bedsService } from './bed.service';

export class BedsController {
  async createWard(req: Request, res: Response) {
    const { name, description } = req.body;

    const ward = await bedsService.createWard(name, description);

    res.json(ward);
  }

  async createRoom(req: Request, res: Response) {
    const { wardId, roomNumber } = req.body;

    const room = await bedsService.createRoom(wardId, roomNumber);

    res.json(room);
  }

  async createBed(req: Request, res: Response) {
    const { roomId, bedNumber } = req.body;

    const bed = await bedsService.createBed(roomId, bedNumber);

    res.json(bed);
  }

  async getBeds(req: Request, res: Response) {
    const beds = await bedsService.getBeds();

    res.json(beds);
  }

  async assignBed(req: Request, res: Response) {
    const { bedId, patientId, admissionId } = req.body;

    const assignment = await bedsService.assignBed(
      bedId,
      patientId,
      admissionId
    );

    res.json({
      message: 'Bed assigned successfully',
      assignment,
    });
  }

  async dischargePatient(req: Request, res: Response) {
    const { admissionId } = req.body;

    await bedsService.dischargePatient(admissionId);

    res.json({
      message: 'Patient discharged and bed released',
    });
  }

  async getActiveAssignments(req: Request, res: Response) {
    const { patientIds } = req.body;

    if (!Array.isArray(patientIds) || patientIds.length === 0) {
      res.json([]);
      return;
    }

    const assignments = await bedsService.getActiveAssignments(patientIds);
    res.json(assignments);
  }

  async getWards(req: Request, res: Response) {
    const wards = await bedsService.getWards();
    res.json(wards);
  }
  async getBedsByRoom(req: Request, res: Response) {
    const roomId = req.params.roomId as string;

    const beds = await bedsService.getBedsByRoom(roomId);

    res.json(beds);
  }

  async getRooms(req: Request, res: Response) {
    const wardId = req.params.wardId as string;

    const rooms = await bedsService.getRoomsByWard(wardId);

    res.json(rooms);
  }
}
