import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  type UserSession = DefaultSession['user'];

  interface Roles {
    role: 'Administrator' | 'User' | 'Member';
  }
  interface LeaveBalance {
    balance: number;
    convertible_balance: number;
    leave_type_id: string;
    leave_type_name: string;
  }

  interface Organization {
    id: string;
    code: string;
    name: string;
    description: string;
  }

  interface User extends UserSession {
    role?: Roles;
    code?: string;
    email?: string;
    user_id?: string;
    leave_balances?: LeaveBalance[] | null;
    organization?: Organization;
    accessToken?: string;
    first_name?: string;
    last_name?: string;
  }

  interface Session {
    user: User;
  }

  interface CredentialsInputs {
    email: string;
    password: string;
  }
}
