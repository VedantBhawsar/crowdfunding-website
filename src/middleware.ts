import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }
  if (req.nextUrl.pathname === '/onboarding') {
    if (!token.onboarded) {
      return NextResponse.rewrite(new URL('/onboarding', req.url));
    } else {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account', '/settings', '/onboarding'],
};
