import { NextRequest, NextResponse } from 'next/server';
import { staffService } from '@/src/lib/server/services/staff.service';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('staffRefreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }

    const result = await staffService.refreshTokens(refreshToken);

    const response = NextResponse.json({
      accessToken: result.accessToken,
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
      { error: err.message || 'Invalid refresh token' },
      { status: 401 }
    );
  }
}
