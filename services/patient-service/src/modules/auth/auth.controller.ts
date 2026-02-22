import { Request, Response } from 'express';
import { patientService } from '../patients/patient.service';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Pool } from 'pg';
import { pool } from '../../db';
import { log } from 'console';

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
      console.log(req.body);
      const result = await patientService.loginPatient(email, password);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        accessToken: result.accessToken,
        patient: result.user,
      });
    } catch {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      console.log('Refresh endpoint hit');
      console.log('cookies recieved ', req.cookies);

      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token' });
      }

      const tokens = await patientService.refreshTokens(refreshToken);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        accessToken: tokens.accessToken,
        userId: tokens.userId,
      });
    } catch {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];

      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        sub: string;
      };

      const patient = await patientService.getPatientById(payload.sub);

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      return res.status(200).json({
        id: patient.id,
        email: patient.email,
        name: patient.name,
        role: patient.role,
      });
    } catch {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      console.log('logout cookies', req.cookies);

      console.log('LOGOUT ROUTE HIT');

      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        const tokenHash = crypto
          .createHash('sha256')
          .update(refreshToken)
          .digest('hex');

        // Find the token row
        const result = await pool.query(
          `SELECT patient_id FROM patient_refresh_tokens WHERE token_hash = $1`,
          [tokenHash]
        );

        const row = result.rows[0];

        if (row) {
          // 🔥 Revoke ALL refresh tokens for that patient
          await pool.query(
            `UPDATE patient_refresh_tokens
           SET revoked = true
           WHERE patient_id = $1`,
            [row.patient_id]
          );
        }
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      });

      return res.status(200).json({ message: 'Logged out' });
    } catch {
      return res.status(500).json({ error: 'Logout failed' });
    }
  }
}
