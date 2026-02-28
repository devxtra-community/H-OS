import 'dotenv/config';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool } from '../../db';
import { randomUUID } from 'crypto';

/**
 * ---- JWT CONFIG
 */
const ACCESS_TOKEN_EXPIRES_IN =
  (process.env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn']) ||
  '15m';

const REFRESH_TOKEN_EXPIRES_IN =
  (process.env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn']) ||
  '7d';

const isProduction = process.env.NODE_ENV === 'production';

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
        SELECT 
          s.id,
          s.name,
          s.email,
          s.password_hash,
          s.role,
          s.job_title,
          d.id AS department_id,
          d.name AS department
        FROM staff s
        JOIN departments d ON s.department_id = d.id
        WHERE s.email = $1
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
          department_id: staff.department_id,
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

      /**
       * 🍪 SET REFRESH TOKEN COOKIE
       */
      res.cookie('staffRefreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        accessToken,
        staff: {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
          job_title: staff.job_title,
          department: staff.department,
        },
      });
    } catch {
      return res.status(500).json({ error: 'Staff login failed' });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.staffRefreshToken;
      if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token' });
      }

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

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
      if (!stored) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      if (stored.revoked) {
        return res.status(401).json({ error: 'Refresh token revoked' });
      }

      if (new Date(stored.expires_at).getTime() < Date.now()) {
        return res.status(401).json({ error: 'Refresh token expired' });
      }

      /**
       * 🔄 REVOKE OLD TOKEN
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

      /**
       * 🍪 ROTATE COOKIE
       */
      res.cookie('staffRefreshToken', newRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        accessToken: newAccessToken,
      });
    } catch {
      return res.status(401).json({ error: 'Refresh failed' });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.staffRefreshToken;

      if (refreshToken) {
        const tokenHash = hashToken(refreshToken);

        const result = await pool.query(
          `SELECT staff_id FROM staff_refresh_tokens WHERE token_hash = $1`,
          [tokenHash]
        );

        const row = result.rows[0];

        if (row) {
          await pool.query(
            `UPDATE staff_refresh_tokens
             SET revoked = true
             WHERE staff_id = $1`,
            [row.staff_id]
          );
        }
      }

      res.clearCookie('staffRefreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
      });

      return res.status(200).json({
        message: 'Staff logged out',
      });
    } catch {
      return res.status(500).json({ error: 'Logout failed' });
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
        type: string;
      };

      if (payload.type !== 'STAFF' && payload.type !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const result = await pool.query(
        `
        SELECT id, name, email, department_id, role, job_title
        FROM staff
        WHERE id = $1
        `,
        [payload.sub]
      );

      return res.status(200).json(result.rows[0]);
    } catch {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
}
