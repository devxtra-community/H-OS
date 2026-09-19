import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/src/lib/server/auth';
import { pharmacyService } from '@/src/lib/server/services/pharmacy.service';

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user?.sub)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { prescriptionId } = await req.json();
    const result = await pharmacyService.dispense(prescriptionId, user.sub);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Dispense failed' },
      { status: 400 }
    );
  }
}
