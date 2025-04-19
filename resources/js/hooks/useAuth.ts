// Hook to extract typed auth data from Inertia page props
import { usePage } from '@inertiajs/react';
import type { PageProps, Tenant, User } from '@/types';

export function useAuth(): { user: User; tenant: Tenant } {
  const { auth } = usePage().props as PageProps;
  return auth;
}
