import { NextResponse } from 'next/server';
import { admissionService } from '@/src/lib/server/services/admission.service';

export async function GET() {
  const pending = await admissionService.getPendingAdmissions();
  return NextResponse.json(pending);
}
