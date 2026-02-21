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
  >(path('/classes/:id/sessions'), async ({ request, params }) => {
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

    const { videoId, sessionTitle } = await request.json();

    const newSessionId = String(Date.now());
    const newSessionTitle = sessionTitle || `${newSessionId}주차`;

    const { classesDB } = await import('../db/classes.db');
    const classData = classesDB.find((c) => c.class.id === params.id);

    if (classData) {
      classData.currentSession = {
        sessionId: newSessionId,
        sessionTitle: newSessionTitle,
        videoId: videoId,
        status: 'ACTIVE',
      };
    }

    return HttpResponse.json({
      sessionId: newSessionId,
      audioUrl:
        'https://github.com/young-52/audio-test/raw/refs/heads/main/no-pain.mp3',
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
  >(
    path('/classes/:id/sessions/:sessionId/status'),
    async ({ request, params }) => {
      const { id, sessionId } = params;
      const { status } = await request.json();

      // Mock DB 업데이트 (실제 환경에서는 DB가 알아서 하겠지만, MSW에서는 명시적으로 수정 필요)
      const { classesDB } = await import('../db/classes.db');
      const classData = classesDB.find((c) => c.class.id === id);
      if (classData && classData.currentSession?.sessionId === sessionId) {
        classData.currentSession.status = status;
        if (status === 'CLOSED') {
          classData.sessions.push({ ...classData.currentSession });
          classData.currentSession = undefined;
        }
      }

      return HttpResponse.json({
        currentStatus: status,
      });
    }
  ),
];
