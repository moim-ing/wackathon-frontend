import type { SessionInfo } from '@/types/classes';

// ---------- POST /api/classes/{id}/sessions ----------

export interface CreateSessionRequest {
  sessionTitle: string;
  videoId: string;
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

export interface PatchSessionStatusRequest {
  status: 'ACTIVE' | 'PAUSED' | 'CLOSED';
}

export interface PatchSessionStatusResponse {
  currentStatus: 'ACTIVE' | 'PAUSED' | 'CLOSED';
  updatedAt: string;
}
