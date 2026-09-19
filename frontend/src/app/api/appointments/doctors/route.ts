import { NextResponse } from 'next/server';
import { staffService } from '@/src/lib/server/services/staff.service';

export async function GET() {
  const doctors = await staffService.getDoctors();
  return NextResponse.json(doctors);
}
