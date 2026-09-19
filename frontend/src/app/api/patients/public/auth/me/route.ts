import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/src/lib/server/auth';
import { patientService } from '@/src/lib/server/services/patient.service';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user || !user.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const patient = await patientService.getPatientById(user.sub);
  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: patient.id,
    email: patient.email,
    name: patient.name,
    role: patient.role,
  });
}
