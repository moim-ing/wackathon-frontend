import {
  createSession,
  createSessionAttendance,
  getSession,
} from '@/api/sessions/sessions';
import { patchSessionStatus } from '@/api/sessions/status';
import type {
  CreateSessionRequest,
  PatchSessionStatusRequest,
  SessionAttendanceRequest,
} from '@/types/sessions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const sessionKeys = {
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
  return useMutation({
    mutationFn: ({
      classId,
      data,
    }: {
      classId: string;
      data: CreateSessionRequest;
    }) => createSession(classId, data),
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
    onSuccess: (
      _,
      variables: {
        classId: string;
        sessionId: string;
        data: PatchSessionStatusRequest;
      }
    ) => {
      // 해당 세션 정보 새로고침
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(variables.classId, variables.sessionId),
      });
    },
    onError: (error: Error) => {
      console.error('Failed to patch session status', error);
    },
  });
}
