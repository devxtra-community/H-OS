import { Request, Response } from 'express';
import { patientService } from '../patients/patient.service';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const patient = await patientService.registerPatient(req.body);
      return res.status(201).json(patient);
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await patientService.loginPatient(email, password);
      return res.status(200).json(result);
    } catch {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const tokens = await patientService.refreshTokens(refreshToken);
      return res.status(200).json(tokens);
    } catch {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
  }
}
