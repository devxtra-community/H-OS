import { NextRequest, NextResponse } from 'next/server';
import { patientService } from '@/src/lib/server/services/patient.service';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const result = await patientService.loginPatient(email, password);

    const response = NextResponse.json({
      accessToken: result.accessToken,
      patient: result.user,
    });

    response.cookies.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Invalid credentials' },
      { status: 401 }
    );
  }
}
