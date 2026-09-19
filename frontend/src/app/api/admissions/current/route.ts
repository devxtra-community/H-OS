import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/src/lib/server/auth';
import { admissionService } from '@/src/lib/server/services/admission.service';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user?.sub)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const current = await admissionService.getCurrentAdmission(user.sub);
  return NextResponse.json(current);
}
