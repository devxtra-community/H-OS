import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/src/lib/server/auth';
import { patientService } from '@/src/lib/server/services/patient.service';

export async function PUT(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user?.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { profile_image } = await req.json();
    if (!profile_image) {
      return NextResponse.json(
        { error: 'profile_image is required' },
        { status: 400 }
      );
    }

    const result = await patientService.updateProfileImage(
      user.sub,
      profile_image
    );
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update profile image' },
      { status: 500 }
    );
  }
}
