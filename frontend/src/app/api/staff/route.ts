import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/src/lib/server/db';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        s.id, 
        s.name, 
        s.email, 
        s.department_id, 
        d.name AS department_name, 
        s.role, 
        s.job_title, 
        s.is_active,
        s.created_at
      FROM staff s
      LEFT JOIN departments d ON s.department_id = d.id
      ORDER BY s.created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch staff accounts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, department_id, role, job_title } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await pool.query(
      `SELECT id FROM staff WHERE LOWER(TRIM(email)) = $1`,
      [cleanEmail]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Staff account already exists with this email' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = randomUUID();

    const result = await pool.query(
      `
      INSERT INTO staff (
        id, name, email, password_hash, department_id, role, job_title, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, true, now(), now())
      RETURNING id, name, email, department_id, role, job_title, is_active, created_at
      `,
      [
        id,
        name.trim(),
        cleanEmail,
        passwordHash,
        department_id || null,
        role,
        job_title || (role === 'DOCTOR' ? 'Resident Doctor' : 'Staff Nurse'),
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to create staff account' },
      { status: 500 }
    );
  }
}
