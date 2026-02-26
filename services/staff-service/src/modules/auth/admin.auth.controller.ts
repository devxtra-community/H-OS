import 'dotenv/config';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../db';

/**
 * ---- JWT CONFIG
 */
const ACCESS_TOKEN_EXPIRES_IN =
  (process.env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn']) ||
  '15m';

const REFRESH_TOKEN_EXPIRES_IN = process.env
  .REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'];

export class AdminAuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await pool.query(
        `
        SELECT id, email, password_hash
        FROM admins
        WHERE email = $1 AND is_active = true
        LIMIT 1
        `,
        [email]
      );

      const admin = result.rows[0];
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const ok = await bcrypt.compare(password, admin.password_hash);
      if (!ok) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      /**
       * 🔐 ACCESS TOKEN
       */
      const accessToken = jwt.sign(
        {
          sub: admin.id,
          type: 'ADMIN',
        },
        process.env.JWT_SECRET!,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );

      /**
       * 🔁 REFRESH TOKEN (COOKIE)
       */
      const refreshToken = jwt.sign(
        {
          sub: admin.id,
          type: 'REFRESH',
        },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
      );

      res.cookie('staffRefreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // true in prod
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        accessToken,
        admin: {
          id: admin.id,
          email: admin.email,
        },
      });
    } catch (err) {
      console.error('ADMIN LOGIN ERROR:', err);
      return res.status(500).json({ error: 'Admin login failed' });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.staffRefreshToken;
      if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token' });
      }

      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as { sub: string };

      const newAccessToken = jwt.sign(
        {
          sub: payload.sub,
          type: 'ADMIN',
        },
        process.env.JWT_SECRET!,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );

      return res.status(200).json({
        accessToken: newAccessToken,
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
        type: string;
      };

      if (payload.type !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const result = await pool.query(
        `SELECT id, email FROM admins WHERE id = $1`,
        [payload.sub]
      );

      return res.status(200).json(result.rows[0]);
    } catch {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.clearCookie('staffRefreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      });

      return res.status(200).json({ message: 'Admin logged out' });
    } catch {
      return res.status(500).json({ error: 'Logout failed' });
    }
  }
}
