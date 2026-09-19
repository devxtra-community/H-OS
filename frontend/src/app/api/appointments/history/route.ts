import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/src/lib/server/auth';
import { appointmentService } from '@/src/lib/server/services/appointment.service';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user?.sub)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const history = await appointmentService.getPatientHistory(user.sub);
  return NextResponse.json(history);
}
