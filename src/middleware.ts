// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import NextAuth from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authConfig } from './lib/auth.config';

const { auth } = NextAuth(authConfig);

const protectedRoutes = ['/dashboard'];

export default auth(async (request: NextRequest) => {
  const path = request.nextUrl.pathname.split('/')[1];

  const isProtectedRoute = protectedRoutes.includes(`/${path}`);
  const cookie = (await cookies()).get('authjs.session-token')?.value;

  if (
    isProtectedRoute &&
    !cookie
    // && !session?.userId // check userId
  ) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
};
