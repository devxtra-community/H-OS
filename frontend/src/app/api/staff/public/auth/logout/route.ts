import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Staff logged out' });
  response.cookies.delete('staffRefreshToken');
  return response;
}
