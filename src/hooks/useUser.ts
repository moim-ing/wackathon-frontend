import { getMyClasses } from '@/api/users/classes';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from './useAuthStore';

export const userKeys = {
  all: ['users'] as const,
  classes: () => [...userKeys.all, 'classes'] as const,
};

export function useMyClasses() {
  const { isLoggedIn } = useAuthStore((state) => state);

  return useQuery({
    queryKey: userKeys.classes(),
    queryFn: () => getMyClasses(),
    enabled: isLoggedIn, // 로그인 상태일 때만 요청
  });
}
