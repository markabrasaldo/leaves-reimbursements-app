import { useSession } from 'next-auth/react';
import { Roles } from 'types';

export default function useRole() {
  const { data: session } = useSession();
  const isAdmin = session?.user.role === ('Administrator' as unknown as Roles);
  const isMember = session?.user.role === ('Member' as unknown as Roles);

  return { isAdmin, isMember };
}
