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
        path: '/staff/public/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ accessToken });
    } catch (err) {
      console.error('ADMIN LOGIN ERROR:', err);
      return res.status(500).json({ error: 'Admin login failed' });
    }
  }
}
