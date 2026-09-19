import { NextRequest, NextResponse } from 'next/server';
import { patientService } from '@/src/lib/server/services/patient.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const patient = await patientService.registerPatient(body);
    return NextResponse.json(patient, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Registration failed' },
      { status: 400 }
    );
  }
}
