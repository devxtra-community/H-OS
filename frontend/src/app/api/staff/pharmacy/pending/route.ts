import { NextResponse } from 'next/server';
import { pharmacyService } from '@/src/lib/server/services/pharmacy.service';

export async function GET() {
  const pending = await pharmacyService.getPendingPrescriptions();
  return NextResponse.json(pending);
}
