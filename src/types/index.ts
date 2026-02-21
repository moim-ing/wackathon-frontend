export interface User {
  name: string;
  email: string;
}

export interface Class {
  id: string;
  title: string;
}

export type SessionStatus = 'ACTIVE' | 'PAUSED' | 'CLOSED';

export interface Session {
  sessionId: string;
  sessionTitle: string;
  videoId: string;
  createdAt?: string; // GET 응답에만 있을 수 있음
  status?: SessionStatus; // currentSession에만 있음
  totalParticipants?: number;
}

export interface Participant {
  id: string;
  name: string;
  participatedAt: string;
}

export interface ApiErrorResponse {
  httpStatusCode: string;
  title: string;
  message: string;
}
