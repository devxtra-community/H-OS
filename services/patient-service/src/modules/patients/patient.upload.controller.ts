import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { generateUploadUrl } from './patient.upload.service';

class PatientUploadController {
  async getUploadUrl(req: Request, res: Response) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
    };

    const patientId = payload.sub;

    const result = await generateUploadUrl(patientId);

    return res.json(result);
  }
}

export const patientUploadController = new PatientUploadController();
