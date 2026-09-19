import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/src/lib/server/auth';
import { patientService } from '@/src/lib/server/services/patient.service';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user?.sub)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await patientService.getPatientProfile(user.sub);
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user?.sub)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const updated = await patientService.upsertPatientProfile(user.sub, body);
  return NextResponse.json(updated);
}
