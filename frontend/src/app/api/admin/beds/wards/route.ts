import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/src/lib/server/db';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, name, description, created_at FROM wards ORDER BY name ASC`
    );
    return NextResponse.json(result.rows);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch wards' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Ward name is required' },
        { status: 400 }
      );
    }

    const id = randomUUID();
    const result = await pool.query(
      `INSERT INTO wards (id, name, description, created_at)
       VALUES ($1, $2, $3, now())
       ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
       RETURNING id, name, description, created_at`,
      [id, name.trim(), description?.trim() || null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to create ward' },
      { status: 500 }
    );
  }
}
