import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/src/lib/server/db';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { wardId, roomNumber } = await req.json();
    if (!wardId || !roomNumber?.trim()) {
      return NextResponse.json(
        { error: 'wardId and roomNumber are required' },
        { status: 400 }
      );
    }

    const id = randomUUID();
    const result = await pool.query(
      `INSERT INTO rooms (id, ward_id, room_number, created_at)
       VALUES ($1, $2, $3, now())
       ON CONFLICT (ward_id, room_number) DO NOTHING
       RETURNING id, ward_id, room_number, created_at`,
      [id, wardId, roomNumber.trim()]
    );

    if (result.rows.length === 0) {
      const existing = await pool.query(
        `SELECT id, ward_id, room_number, created_at FROM rooms WHERE ward_id = $1 AND room_number = $2`,
        [wardId, roomNumber.trim()]
      );
      return NextResponse.json(existing.rows[0]);
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to create room' },
      { status: 500 }
    );
  }
}
