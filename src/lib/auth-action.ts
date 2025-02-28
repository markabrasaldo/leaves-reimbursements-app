'use server';

import { signIn, signOut } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function authentication(
  prevState: { messageType: string; message: string } | undefined,
  formData: FormData
) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      return { messageType: 'error', message: 'Invalid credentials.' };
    }

    redirect('/dashboard');
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
  revalidatePath('/');
  await signOut({ redirectTo: '/' });
}
