import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/src/lib/server/auth';
import { appointmentService } from '@/src/lib/server/services/appointment.service';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user?.sub)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const date = new Date().toISOString().split('T')[0];
  const active = await appointmentService.getPatientActiveStatus(
    user.sub,
    date
  );
  return NextResponse.json(active);
}
