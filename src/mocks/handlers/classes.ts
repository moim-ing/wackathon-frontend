import type {
  CreateClassRequest,
  CreateClassResponse,
  GetClassResponse,
} from '@/types/classes';
import type { ApiErrorResponse } from '@/types/index';
import { http, HttpResponse } from 'msw';
import { classesDB } from '../db/classes.db';
import { path } from '../utils';

export const classesHandlers = [
  // 1. 새 클래스 만들기
  http.post<never, CreateClassRequest, CreateClassResponse | ApiErrorResponse>(
    path('/classes'),
    async ({ request }) => {
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

      const { title } = await request.json();

      const newId = String(Date.now());
      classesDB.push({
        class: { id: newId, title },
        sessions: [],
      });

      return HttpResponse.json({ id: newId }, { status: 201 });
    }
  ),

  // 2. 클래스 정보 조회
  http.get<{ id: string }, never, GetClassResponse | ApiErrorResponse>(
    path('/classes/:id'),
    ({ request, params }) => {
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

      const { id } = params;
      const classData = classesDB.find((c) => c.class.id === id);

      if (classData) {
        return HttpResponse.json(classData);
      }

      return HttpResponse.json(
        {
          httpStatusCode: 'NOT_FOUND',
          title: '클래스를 찾을 수 없습니다.',
          message: 'Class not found',
        } as ApiErrorResponse,
        { status: 404 }
      );
    }
  ),
];
