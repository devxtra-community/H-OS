import { NextRequest, NextResponse } from 'next/server';
import { bedsService } from '@/src/lib/server/services/bed.service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wardId = searchParams.get('wardId');
  if (!wardId)
    return NextResponse.json({ error: 'wardId required' }, { status: 400 });

  const rooms = await bedsService.getRoomsByWard(wardId);
  return NextResponse.json(rooms);
}
