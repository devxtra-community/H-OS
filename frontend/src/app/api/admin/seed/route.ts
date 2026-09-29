import { NextResponse } from 'next/server';
import { pool } from '@/src/lib/server/db';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export async function POST() {
  try {
    const deptRes = await pool.query(
      `SELECT id FROM departments WHERE name = 'General Medicine' LIMIT 1`
    );
    let genMedId = deptRes.rows[0]?.id;

    if (!genMedId) {
      genMedId = randomUUID();
      await pool.query(
        `INSERT INTO departments (id, name) VALUES ($1, 'General Medicine') ON CONFLICT (name) DO NOTHING`,
        [genMedId]
      );
    }

    const adminPass = await bcrypt.hash('123', 10);
    await pool.query(
      `
      INSERT INTO staff (id, name, email, password_hash, department_id, role, job_title)
      VALUES ($1, 'System Admin', 'admin@gmail.com', $2, $3, 'ADMIN', 'System Administrator')
      ON CONFLICT (email) DO UPDATE SET password_hash = $2, role = 'ADMIN'
      `,
      [randomUUID(), adminPass, genMedId]
    );

    return NextResponse.json({
      success: true,
      message: 'Admin account created: admin@gmail.com / 123',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
