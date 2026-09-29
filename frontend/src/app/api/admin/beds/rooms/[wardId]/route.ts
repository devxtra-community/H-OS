import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/src/lib/server/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ wardId: string }> }
) {
  try {
    const { wardId } = await params;
    const result = await pool.query(
      `SELECT id, ward_id, room_number, created_at FROM rooms WHERE ward_id = $1 ORDER BY room_number ASC`,
      [wardId]
    );
    return NextResponse.json(result.rows);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}
