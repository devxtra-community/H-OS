import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/src/lib/server/db';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      type: string;
    };

    if (payload.type !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let result = await pool.query(
      `SELECT id, email FROM admins WHERE id = $1`,
      [payload.sub]
    );

    let admin = result.rows[0];
    if (!admin) {
      const staffRes = await pool.query(
        `SELECT id, email FROM staff WHERE id = $1 AND role = 'ADMIN'`,
        [payload.sub]
      );
      admin = staffRes.rows[0];
    }

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
