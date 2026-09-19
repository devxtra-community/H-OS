import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/src/lib/server/auth';
import { pharmacyService } from '@/src/lib/server/services/pharmacy.service';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user?.sub)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const prescriptions = await pharmacyService.getPatientPrescriptions(user.sub);
  return NextResponse.json(prescriptions);
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user?.sub)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const created = await pharmacyService.createPrescription({
    patientId: body.patientId,
    patientName: body.patientName,
    doctorId: user.sub,
    items: body.items,
  });

  return NextResponse.json(created, { status: 201 });
}
