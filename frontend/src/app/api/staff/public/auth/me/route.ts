import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/src/lib/server/auth';
import { staffService } from '@/src/lib/server/services/staff.service';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user?.sub)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const staff = await staffService.getStaffById(user.sub);
  if (!staff)
    return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

  return NextResponse.json(staff);
}
