import { NextResponse } from 'next/server';
import { bedsService } from '@/src/lib/server/services/bed.service';

export async function GET() {
  const wards = await bedsService.getWards();
  return NextResponse.json(wards);
}
