import { api } from '@/lib/api'; // Asumsi wrapper axios ada di sini
import { UserProfile } from '@/types/auth';

export const getAuthUser = async (): Promise<UserProfile> => {
  const { data } = await api.get('/users/me');
  return data;
};
