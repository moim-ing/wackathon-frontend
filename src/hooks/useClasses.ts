import { createClass, getClass } from '@/api/classes/classes';
import type { CreateClassRequest } from '@/types/classes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userKeys } from './useUser';

import { usePatchSessionStatus } from './useSessions';

export const classesKeys = {
  all: ['classes'] as const,
  detail: (id: string) => [...classesKeys.all, id] as const,
};

export function useClass(id: string) {
  const query = useQuery({
    queryKey: classesKeys.detail(id),
    queryFn: () => getClass(id),
    enabled: !!id,
  });

  const { mutate: patchStatus } = usePatchSessionStatus();

  const updateStatus = (status: 'ACTIVE' | 'PAUSED' | 'CLOSED') => {
    const currentSession = query.data?.currentSession;
    if (id && currentSession) {
      patchStatus({
        classId: id,
        sessionId: currentSession.sessionId,
        data: {
          status,
          currentTime: 0,
          updatedAt: Date.now(),
        },
      });
    }
  };

  return { ...query, updateStatus };
}

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClassRequest) => createClass(data),
    onSuccess: () => {
      // 내 클래스 목록 갱신
      queryClient.invalidateQueries({ queryKey: userKeys.classes() });
    },
    onError: (error) => {
      console.error('Failed to create class', error);
    },
  });
}
