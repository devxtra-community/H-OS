import { NextRequest, NextResponse } from 'next/server';
import { bedsService } from '@/src/lib/server/services/bed.service';

export async function POST(req: NextRequest) {
  try {
    const { admissionId } = await req.json();
    await bedsService.dischargePatient(admissionId);
    return NextResponse.json({ message: 'Discharged successfully' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Discharge failed' },
      { status: 400 }
    );
  }
}
