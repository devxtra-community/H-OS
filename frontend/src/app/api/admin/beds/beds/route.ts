import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/src/lib/server/db';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { roomId, bedNumber, bedType } = await req.json();
    if (!roomId || !bedNumber?.trim()) {
      return NextResponse.json(
        { error: 'roomId and bedNumber are required' },
        { status: 400 }
      );
    }

    const id = randomUUID();
    const result = await pool.query(
      `INSERT INTO beds (id, room_id, bed_number, bed_type, status, created_at)
       VALUES ($1, $2, $3, $4, 'AVAILABLE', now())
       ON CONFLICT (room_id, bed_number) DO UPDATE SET
         bed_type = EXCLUDED.bed_type
       RETURNING id, room_id, bed_number, bed_type, status, created_at`,
      [id, roomId, bedNumber.trim(), bedType || 'GENERAL']
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to create bed' },
      { status: 500 }
    );
  }
}
