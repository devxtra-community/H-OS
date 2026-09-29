import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('staffRefreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }

    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as {
      sub: string;
      type: string;
    };

    const accessToken = jwt.sign(
      { sub: payload.sub, type: 'ADMIN' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return NextResponse.json({ accessToken });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Invalid refresh token' },
      { status: 401 }
    );
  }
}
