import {
  createSession,
  createSessionAttendance,
  getSession,
} from '@/api/sessions/sessions';
import type {
  CreateSessionRequest,
  SessionAttendanceRequest,
} from '@/types/sessions';
import { useMutation, useQuery } from '@tanstack/react-query';

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
