import { NextRequest, NextResponse } from 'next/server';
import { bedsService } from '@/src/lib/server/services/bed.service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get('roomId');
  if (!roomId)
    return NextResponse.json({ error: 'roomId required' }, { status: 400 });

  const beds = await bedsService.getBedsByRoom(roomId);
  return NextResponse.json(beds);
}
