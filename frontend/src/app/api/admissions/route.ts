import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/src/lib/server/auth';
import { admissionService } from '@/src/lib/server/services/admission.service';

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user?.sub)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const admission = await admissionService.createAdmission({
    patientId: body.patientId || user.sub,
    doctorId: body.doctorId,
    departmentId: body.departmentId,
  });

  return NextResponse.json(admission, { status: 201 });
}
