import { NextResponse } from 'next/server';
import { pool } from '@/src/lib/server/db';

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, name FROM departments ORDER BY name ASC`
    );
    return NextResponse.json(result.rows);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}
