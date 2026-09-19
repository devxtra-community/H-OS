import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/src/lib/server/auth';
import { appointmentService } from '@/src/lib/server/services/appointment.service';

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user?.sub)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const appointment = await appointmentService.createAppointment({
    doctorId: body.doctorId,
    patientId: user.sub,
    appointmentTime: new Date(body.appointmentTime),
    durationMinutes: body.durationMinutes || 30,
    priority: body.priority || 'NORMAL',
  });

  return NextResponse.json(appointment, { status: 201 });
}
