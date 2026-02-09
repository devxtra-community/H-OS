import 'dotenv/config';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool } from '../../db';
import { randomUUID } from 'crypto';

/**
 * ---- JWT CONFIG (typed to avoid TS overload issues)
 */
const ACCESS_TOKEN_EXPIRES_IN = process.env
  .ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'];

const REFRESH_TOKEN_EXPIRES_IN = process.env
  .REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'];

/**
 * ---- HELPERS
 */
function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export class StaffAuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await pool.query(
        `
        SELECT id, name, email, password_hash, role, job_title, department
        FROM staff
        WHERE email = $1 AND is_active = true
        LIMIT 1
        `,
        [email]
      );

      const staff = result.rows[0];
      if (!staff) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const ok = await bcrypt.compare(password, staff.password_hash);
      if (!ok) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      /**
       * 🔐 ACCESS TOKEN
       */
      const accessToken = jwt.sign(
        {
          sub: staff.id,
          type: 'STAFF',
          role: staff.role,
          job_title: staff.job_title,
          department: staff.department,
        },
        process.env.JWT_SECRET!,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );

      /**
       * 🔁 REFRESH TOKEN
       */
      const refreshToken = jwt.sign(
        {
          sub: staff.id,
          type: 'REFRESH',
        },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
      );

      /**
       * 💾 STORE HASHED REFRESH TOKEN
       */
      await pool.query(
        `
        INSERT INTO staff_refresh_tokens
          (id, staff_id, token_hash, expires_at)
        VALUES
          ($1, $2, $3, now() + interval '7 days')
        `,
        [randomUUID(), staff.id, hashToken(refreshToken)]
      );

      return res.status(200).json({
        accessToken,
        refreshToken,
        staff: {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
          job_title: staff.job_title,
          department: staff.department,
        },
      });
    } catch (err) {
      console.error('STAFF LOGIN ERROR:', err);
      return res.status(500).json({ error: 'Staff login failed' });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as { sub: string };

      const tokenHash = hashToken(refreshToken);

      const result = await pool.query(
        `
        SELECT id, staff_id, revoked, expires_at
        FROM staff_refresh_tokens
        WHERE token_hash = $1
        `,
        [tokenHash]
      );

      const stored = result.rows[0];
      if (!stored || stored.revoked || stored.expires_at < new Date()) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      /**
       * 🔄 ROTATE: revoke old refresh token
       */
      await pool.query(
        `UPDATE staff_refresh_tokens SET revoked = true WHERE id = $1`,
        [stored.id]
      );

      /**
       * 🔐 NEW ACCESS TOKEN
       */
      const newAccessToken = jwt.sign(
        {
          sub: stored.staff_id,
          type: 'STAFF',
        },
        process.env.JWT_SECRET!,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );

      /**
       * 🔁 NEW REFRESH TOKEN
       */
      const newRefreshToken = jwt.sign(
        {
          sub: stored.staff_id,
          type: 'REFRESH',
        },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
      );

      await pool.query(
        `
        INSERT INTO staff_refresh_tokens
          (id, staff_id, token_hash, expires_at)
        VALUES
          ($1, $2, $3, now() + interval '7 days')
        `,
        [randomUUID(), stored.staff_id, hashToken(newRefreshToken)]
      );

      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (err) {
      console.error('STAFF REFRESH ERROR:', err);
      return res.status(401).json({ error: 'Refresh failed' });
    }
  }
}
