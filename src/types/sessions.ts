import type { SessionInfo } from '@/types/classes';

// ---------- POST /api/classes/{id}/sessions ----------

export interface CreateSessionRequest {
  sessionTitle: string;
  videoId: string;
  videoKey: string;
}

export interface CreateSessionResponse {
  sessionId: string;
}

// ---------- GET /api/classes/{id}/sessions/{sessionId} ----------
export interface SessionParticipant {
  id: string;
  name: string;
  participatedAt: string;
}

export interface GetSessionResponse extends SessionInfo {
  participants: SessionParticipant[];
}

// ---------- POST /api/classes/{id}/sessions/{sessionId} ----------

export interface SessionAttendanceRequest {
  name: string;
  verifiedAt: string;
}

export interface SessionAttendanceResponse {
  id: string; // attendance identifier
}

// ---------- PATCH /api/classes/{id}/sessions/{sessionId}/status ----------

export type SessionStatus = 'ACTIVE' | 'PAUSED' | 'CLOSED';

export interface PatchSessionStatusRequest {
  status: SessionStatus;
  currentTime: number;
  updatedAt: number;
}

export interface PatchSessionStatusResponse {
  currentStatus: SessionStatus;
}
