import type { ApiErrorResponse } from '@/types/index';
import type { GetMeResponse, GetMyClassesResponse } from '@/types/users';
import { http, HttpResponse } from 'msw';
import { classesDB } from '../db/classes.db';
import { userDB } from '../db/user.db';
import { path } from '../utils';

export const userHandlers = [
  // 1. 내 정보 조회
  http.get<never, never, GetMeResponse | ApiErrorResponse>(
    path('/users/me'),
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

      const token = authHeader.split(' ')[1];
      const user = userDB.find((u) => u.token === token);

      if (!user) {
        return HttpResponse.json(
          {
            httpStatusCode: 'UNAUTHORIZED',
            title: '권한 없음',
            message: 'User needs to be logged in',
          } as ApiErrorResponse,
          { status: 401 }
        );
      }

      return HttpResponse.json({
        name: user.name,
        email: user.email,
      } as GetMeResponse);
    }
  ),

  // 2. 구글 클래스룸과 유사한 탭 확인 (나의 클래스 요청)
  http.get<never, never, GetMyClassesResponse | ApiErrorResponse>(
    path('/users/classes'),
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

      const token = authHeader.split(' ')[1];
      const user = userDB.find((u) => u.token === token);

      if (!user) {
        return HttpResponse.json(
          {
            httpStatusCode: 'UNAUTHORIZED',
            title: '권한 없음',
            message: 'User needs to be logged in',
          } as ApiErrorResponse,
          { status: 401 }
        );
      }

      return HttpResponse.json({
        classes: classesDB.map((c) => c.class),
      });
    }
  ),
];
