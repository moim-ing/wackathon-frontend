import type { Class } from '@/types';

// ---------- POST /api/classes ----------

export interface CreateClassRequest {
  title: string;
}

export interface CreateClassResponse {
  id: string; // The backend returns id as string
}

// ---------- GET /api/classes/{id} ----------

export interface SessionInfo {
  sessionId: string;
  sessionTitle: string;
  videoId: string;
  createdAt?: string; // GET 응답에만 있을 수 있음
  status?: 'ACTIVE' | 'PAUSED' | 'CLOSED'; // currentSessions 와일 때
  totalParticipants?: number;
}

export interface GetClassResponse {
  class: Class;
  sessions: SessionInfo[];
  currentSession?: SessionInfo;
}
