import { NextRequest, NextResponse } from 'next/server';
import { appointmentService } from '@/src/lib/server/services/appointment.service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get('doctorId');
  const date = searchParams.get('date');

  if (!doctorId || !date) {
    return NextResponse.json(
      { error: 'doctorId and date required' },
      { status: 400 }
    );
  }

  const slots = await appointmentService.getBookedSlots(doctorId, date);
  return NextResponse.json(slots);
}
