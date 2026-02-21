import apiClient from '@/api/apiClient';
import type {
  CreateSessionRequest,
  CreateSessionResponse,
  GetSessionResponse,
  SessionAttendanceRequest,
  SessionAttendanceResponse,
} from '@/types/sessions';

// 1. 새 세션 만들기 (POST /api/classes/{id}/sessions)
export async function createSession(
  classId: string,
  data: CreateSessionRequest
): Promise<CreateSessionResponse> {
  const response = await apiClient.post(`/classes/${classId}/sessions`, data);
  return response.data;
}

// 2. 세션 정보 조회 (GET /api/classes/{id}/sessions/{sessionId})
export async function getSession(
  classId: string,
  sessionId: string
): Promise<GetSessionResponse> {
  const response = await apiClient.get(
    `/classes/${classId}/sessions/${sessionId}`
  );
  return response.data;
}

// 3. 학생 출석체크 등록 폼 제출 (POST /api/classes/{id}/sessions/{sessionId})
export async function createSessionAttendance(
  classId: string,
  sessionId: string,
  data: SessionAttendanceRequest
): Promise<SessionAttendanceResponse> {
  const response = await apiClient.post(
    `/classes/${classId}/sessions/${sessionId}`,
    data
  );
  return response.data;
}
