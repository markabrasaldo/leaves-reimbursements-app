'use server';

import { signIn, signOut } from '@/lib/auth';
import { AuthError } from 'next-auth';

export async function authentication(
  prevState: { messageType: string; message: string } | undefined,
  formData: FormData
) {
  try {
    formData.append('redirectTo', '/dashboard');
    await signIn('credentials', formData);
    return { messageType: 'success', message: 'Signed In Successfully!' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { messageType: 'error', message: 'Invalid Credentials.' };

        default:
          return { messageType: 'error', message: 'Something went wrong' };
      }
    }
    throw error;
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
