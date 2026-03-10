import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { generateUploadUrl, deleteFile } from './patient.upload.service';

class PatientUploadController {
  async getUploadUrl(req: Request, res: Response) {
    const patientId = req.headers['x-user-id'] as string;

    if (!patientId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const fileType = req.query.fileType as string;
    const type = req.query.type as 'profile' | 'document';

    if (!fileType || !type) {
      return res.status(400).json({
        error: 'fileType and type are required',
      });
    }

    const result = await generateUploadUrl(patientId, fileType, type);

    return res.json(result);
  }
  async deleteFile(req: Request, res: Response) {
    try {
      const key = req.body.key;

      if (!key) {
        return res.status(400).json({
          error: 'File key required',
        });
      }

      await deleteFile(key);

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: 'Failed to delete file',
      });
    }
  }
}

export const patientUploadController = new PatientUploadController();
