import {
  createSession,
  createSessionAttendance,
  getSession,
} from '@/api/sessions/sessions';
import { patchSessionStatus } from '@/api/sessions/status';
import type { GetClassResponse } from '@/types/classes';
import type {
  CreateSessionRequest,
  PatchSessionStatusRequest,
  SessionAttendanceRequest,
} from '@/types/sessions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { classesKeys } from './useClasses';

const sessionKeys = {
  all: ['sessions'] as const,
  detail: (classId: string, sessionId: string) =>
    [...sessionKeys.all, classId, sessionId] as const,
};

export function useSession(classId: string, sessionId: string) {
  return useQuery({
    queryKey: sessionKeys.detail(classId, sessionId),
    queryFn: () => getSession(classId, sessionId),
    enabled: !!classId && !!sessionId,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classId,
      data,
    }: {
      classId: string;
      data: CreateSessionRequest;
    }) => createSession(classId, data),
    onSuccess: (data, variables) => {
      // 갱신 전 즉시 UI 반영을 위해 캐시 수동 업데이트
      queryClient.setQueryData<GetClassResponse>(
        classesKeys.detail(variables.classId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            currentSession: {
              sessionId: data.sessionId,
              sessionTitle: variables.data.sessionTitle,
              videoId: variables.data.videoId,
              audioUrl: data.audioUrl,
              status: 'ACTIVE',
            },
          };
        }
      );
      queryClient.invalidateQueries({
        queryKey: classesKeys.detail(variables.classId),
      });
    },
    onError: (error: Error) => {
      console.error('Failed to create session', error);
    },
  });
}

export function useSessionAttendance() {
  return useMutation({
    mutationFn: ({
      classId,
      sessionId,
      data,
    }: {
      classId: string;
      sessionId: string;
      data: SessionAttendanceRequest;
    }) => createSessionAttendance(classId, sessionId, data),
    onError: (error: Error) => {
      console.error('Failed to register attendance', error);
    },
  });
}

export function usePatchSessionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classId,
      sessionId,
      data,
    }: {
      classId: string;
      sessionId: string;
      data: PatchSessionStatusRequest;
    }) => patchSessionStatus(classId, sessionId, data),
    onMutate: async (variables) => {
      // 1. 진행 중인 리페치 취소 (데이터 충돌 방지)
      await queryClient.cancelQueries({
        queryKey: classesKeys.detail(variables.classId),
      });

      // 2. 이전 데이터 스냅샷
      const previousClassData = queryClient.getQueryData<GetClassResponse>(
        classesKeys.detail(variables.classId)
      );

      // 3. 캐시 데이터 낙관적 업데이트
      if (previousClassData) {
        queryClient.setQueryData<GetClassResponse>(
          classesKeys.detail(variables.classId),
          {
            ...previousClassData,
            currentSession: previousClassData.currentSession
              ? {
                  ...previousClassData.currentSession,
                  status: variables.data.status,
                }
              : undefined,
          }
        );
      }

      return { previousClassData };
    },
    onError: (error: Error, variables, context) => {
      console.error('Failed to patch session status', error);
      // 에러 발생 시 원래 데이터로 복구
      if (context?.previousClassData) {
        queryClient.setQueryData(
          classesKeys.detail(variables.classId),
          context.previousClassData
        );
      }
    },
    onSettled: (_, __, variables) => {
      // 성공하든 실패하든 서버와 최종 동기화
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(variables.classId, variables.sessionId),
      });
      queryClient.invalidateQueries({
        queryKey: classesKeys.detail(variables.classId),
      });
    },
  });
}
