import type { ApiErrorResponse } from '@/types/index';
import type {
  CreateSessionRequest,
  CreateSessionResponse,
  GetSessionResponse,
  PatchSessionStatusRequest,
  PatchSessionStatusResponse,
  SessionAttendanceRequest,
  SessionAttendanceResponse,
} from '@/types/sessions';
import { http, HttpResponse } from 'msw';
import { sessionsDB } from '../db/sessions.db';
import { path } from '../utils';

export const sessionsHandlers = [
  // 1. 새 세션 만들기
  http.post<
    { id: string },
    CreateSessionRequest,
    CreateSessionResponse | ApiErrorResponse
  >(path('/classes/:id/sessions'), async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json(
        {
          httpStatusCode: 'UNAUTHORIZED',
          title: '권한 없음',
          message: 'User needs to be logged in',
        } as ApiErrorResponse,
        { status: 401 }
      );
    }

    // 비디오 ID를 요청 바디에서 체크하는 경우 여기에 사용할 수 있습니다.
    await request.json();

    const newSessionId = String(Date.now());
    const newSessionTitle = `${newSessionId}주차`;

    return HttpResponse.json({
      sessionId: newSessionId,
      sessionTitle: newSessionTitle,
    } as CreateSessionResponse);
  }),

  // 2. 세션 정보 조회
  http.get<
    { id: string; sessionId: string },
    never,
    GetSessionResponse | ApiErrorResponse
  >(path('/classes/:id/sessions/:sessionId'), ({ request, params }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json(
        {
          httpStatusCode: 'UNAUTHORIZED',
          title: '권한 없음',
          message: 'User needs to be logged in',
        } as ApiErrorResponse,
        { status: 401 }
      );
    }
    const { sessionId } = params;
    const sessionData = sessionsDB[sessionId];

    if (sessionData) {
      return HttpResponse.json(sessionData);
    }
    return HttpResponse.json(
      {
        httpStatusCode: 'NOT_FOUND',
        title: '세션을 찾을 수 없습니다.',
        message: 'Event not found',
      } as ApiErrorResponse,
      { status: 404 }
    );
  }),

  // 3. 학생 출석체크 등록 요청
  http.post<
    { id: string; sessionId: string },
    SessionAttendanceRequest,
    SessionAttendanceResponse | ApiErrorResponse
  >(path('/classes/:id/sessions/:sessionId'), async ({ request }) => {
    // 요청 형식을 검사하는 곳
    await request.json();
    return HttpResponse.json({ id: '1' });
  }),

  // 4. 음악 재생 상태 변경
  http.patch<
    { id: string; sessionId: string },
    PatchSessionStatusRequest,
    PatchSessionStatusResponse | ApiErrorResponse
  >(path('/classes/:id/sessions/:sessionId/status'), async ({ request }) => {
    const { status } = await request.json();

    return HttpResponse.json({
      currentStatus: status,
      updatedAt: new Date().toISOString(),
    });
  }),
];
