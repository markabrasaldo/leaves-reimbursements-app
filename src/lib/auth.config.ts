import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import getConfig from 'next/config';
import { Roles, LeaveBalanceType, Organization } from 'types';
import { z } from 'zod';

const authConfig = {
  providers: [
    CredentialProvider({
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials): Promise<any> {
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
          const { email, password } = parsedCredentials.data;

          const payload = {
            email,
            password
          };

          const { publicRuntimeConfig } = getConfig();
          const baseUrl = publicRuntimeConfig.baseUrlIam;

          const response = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            cache: 'force-cache',
            body: JSON.stringify(payload)
          });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(responseData.message || 'Something went wrong');
          }

          if (response.ok && responseData) {
            const arrayToken = responseData.token.split('.');

            const userTokenDetails = JSON.parse(atob(arrayToken[1]));

            const user = {
              ...userTokenDetails,
              accessToken: responseData.token
            };

            return user;
          }
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
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
    jwt: async ({ token, user, account }) => {
      if (account && user) {
        token.user_id = user.user_id;
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.code = user.code;
        token.organization = user.organization;
        token.leave_balances = user.leave_balances;
      }
      return token;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          code: token.code as string,
          email: token.email,
          leave_balances: token.leave_balances as LeaveBalanceType[],
          organization: token.organization as Organization,
          role: token.role as Roles,
          user_id: token.user_id as string,
          accessToken: token.accessToken as string,
          accessTokenExpires: token.accessTokenExpires as number
        },
        error: token.error
      };
    }
  }
} satisfies NextAuthConfig;

export { authConfig };
