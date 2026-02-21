import type { GetSessionResponse } from '@/types/sessions';

// Mock DB for sessions
export const sessionsDB: Record<string, GetSessionResponse> = {
  '1': {
    sessionId: '1',
    sessionTitle: '1주차',
    videoId: 'hHHQ4bNhwjU',
    createdAt: '2026-02-02T20:00:00Z',
    totalParticipants: 8,
    participants: [
      {
        id: '1',
        name: '홍길동',
        participatedAt: '2026-02-02T20:00:00Z',
      },
    ],
  },
};
