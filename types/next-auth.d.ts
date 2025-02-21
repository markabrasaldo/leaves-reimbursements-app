import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  type UserSession = DefaultSession['user'];

  interface User {
    role?: string;
  }

  interface Session {
    user: {
      role?: string;
    } & DefaultSession['user'];
  }

  interface CredentialsInputs {
    email: string;
    password: string;
  }
}
