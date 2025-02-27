import { auth } from '@/lib/auth';

export async function getSessionDetails() {
  const session = await auth();

  return { ...session?.user };
}
