// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const { auth } = NextAuth(authConfig);

const protectedRoutes = ['/dashboard/:path*'];
const publicRoutes = ['/login', '/signup', '/'];

export default auth(async (request: NextRequest) => {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const cookie = (await cookies()).get('authjs.session-token')?.value;

  // if passs is decrypted
  // const session = await decrypt(cookie)

  if (
    isProtectedRoute &&
    cookie
    // && !session?.userId // check userId
  ) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (
    isPublicRoute &&
    // session?.userId && // check userId
    cookie && //temp
    !request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  return NextResponse.next();
});

// export const config = { matcher: ['/dashboard/:path*'] };
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
};
