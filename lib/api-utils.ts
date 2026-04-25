import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { signToken, verifyToken } from './jwt';
import { serialize } from 'cookie';

export async function createAuthCookie(response: NextResponse, user: { id: string; email: string; name: string }) {
  const token = await signToken({ id: user.id, email: user.email, name: user.name });

  const cookie = serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  response.headers.set('Set-Cookie', cookie);
  return response;
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    const payload = await verifyToken(token);
    return payload;
  } catch {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json(
    { message: 'Unauthorized' },
    { status: 401 }
  );
}