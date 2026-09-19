import { NextResponse } from 'next/server';
import { bedsService } from '@/src/lib/server/services/bed.service';

export async function GET() {
  const beds = await bedsService.getBeds();
  return NextResponse.json(beds);
}
