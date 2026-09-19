import { NextRequest, NextResponse } from 'next/server';
import { bedsService } from '@/src/lib/server/services/bed.service';

export async function POST(req: NextRequest) {
  try {
    const { bedId, patientId, admissionId } = await req.json();
    const assignment = await bedsService.assignBed(
      bedId,
      patientId,
      admissionId
    );
    return NextResponse.json(assignment, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Assign bed failed' },
      { status: 400 }
    );
  }
}
