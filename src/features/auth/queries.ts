import { useQuery } from '@tanstack/react-query';

import { getAuthUser } from './api';

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

export function useAuthUserQuery() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getAuthUser,
    retry: false, // Tidak retry jika 401 (Unauthorized)
  });
}
