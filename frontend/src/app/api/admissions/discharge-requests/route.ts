import { NextResponse } from 'next/server';
import { admissionService } from '@/src/lib/server/services/admission.service';

export async function GET() {
  const requests = await admissionService.getDischargeRequests();
  return NextResponse.json(requests);
}
