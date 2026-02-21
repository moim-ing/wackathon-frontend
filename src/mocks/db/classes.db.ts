import type { GetClassResponse } from '@/types/classes';

// Mock DB for classes
export const classesDB: GetClassResponse[] = [
  {
    class: {
      id: '1',
      title: '알고리즘',
    },
    sessions: [
      {
        sessionId: '1',
        sessionTitle: '1주차',
        videoId: 'hHHQ4bNhwjU',
        createdAt: '2026-02-02T20:00:00Z',
        totalParticipants: 8,
      },
    ],
    currentSession: {
      sessionId: '2',
      sessionTitle: '2주차',
      videoId: 'hHHQ4bNhwjU',
      status: 'ACTIVE',
      createdAt: '2026-02-03T20:00:00Z',
      totalParticipants: 8,
    },
  },
];
