import { NextRequest, NextResponse } from 'next/server';
import { staffService } from '@/src/lib/server/services/staff.service';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const result = await staffService.loginStaff(email, password);

    const response = NextResponse.json({
      accessToken: result.accessToken,
      staff: result.staff,
    });

    response.cookies.set('staffRefreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Staff login failed' },
      { status: 401 }
    );
  }
}
