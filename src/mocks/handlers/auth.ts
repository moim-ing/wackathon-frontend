import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
} from '@/types/auth';
import type { ApiErrorResponse } from '@/types/index';
import { http, HttpResponse, delay } from 'msw';
import { userDB } from '../db/user.db';
import type { MockUser } from '../types';
import { path } from '../utils';

export const authHandlers = [
  // 1. 로그인
  http.post<never, LoginRequest, LoginResponse | ApiErrorResponse>(
    path('/auth/login'),
    async ({ request }) => {
      const { email, password } = await request.json();

      const user = userDB.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        await delay(500);
        return HttpResponse.json({
          token: user.token,
        });
      }

      return HttpResponse.json(
        {
          httpStatusCode: 'UNAUTHORIZED',
          title: '로그인 실패',
          message: 'Authenticate failed',
        } as ApiErrorResponse,
        { status: 401 }
      );
    }
  ),

  // 2. 회원가입
  http.post<never, SignUpRequest, SignUpResponse>(
    path('/auth/signup'),
    async ({ request }) => {
      const newUser = await request.json();

      const id = Date.now();
      const mockUser: MockUser = {
        ...newUser,
        password: newUser.password,
        token: `mock-token-for-user-${id}`,
      };

      userDB.push(mockUser);
      return HttpResponse.json({ token: mockUser.token });
    }
  ),

  // 3. 로그아웃
  http.post<never, never, never>(path('/auth/logout'), () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
