import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import GithubProvider from 'next-auth/providers/github';

const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? ''
    }),
    CredentialProvider({
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },

      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z
              .string()
              .trim()
              .email({ message: 'Enter a valid email address' }),
            password: z
              .string()
              .trim()
              .min(6, { message: 'Minimum of 6 characters or digits' })
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email } = parsedCredentials.data;

          const user = {
            id: '1',
            role: 'Admin',
            email: email as string
          };

          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
  pages: {
    signIn: '/' //sigin page
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const onDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (onDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    session({ session, token }) {
      return { ...session, ...token };
    }
  }
} satisfies NextAuthConfig;

export default authConfig;
