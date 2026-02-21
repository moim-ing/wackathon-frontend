import type { GetFileResponse, UploadFileResponse } from '@/types/file';
import type { ApiErrorResponse } from '@/types/index';
import { http, HttpResponse, delay } from 'msw';
import { path } from '../utils';

export const fileHandlers = [
  // 1. 파일 업로드 요청
  http.post<never, FormData, UploadFileResponse | ApiErrorResponse>(
    path('/file'),
    async () => {
      // const formData = await request.formData();
      // const file = formData.get('file');

      await delay(500);

      const mockResponse: UploadFileResponse = {
        key: 'mock-audio-file-key-' + Date.now(),
      };

      return HttpResponse.json(mockResponse);
    }
  ),

  // 2. 세션 아이디로 파일 정보 조회
  http.get<{ sessionId: string }, never, GetFileResponse | ApiErrorResponse>(
    path('/file/:sessionId'),
    async ({ params }) => {
      const { sessionId } = params;
      await delay(200);

      const mockResponse: GetFileResponse = {
        key: 'mock-audio-file-key-for-session-' + sessionId,
        url: 'https://example.com/mock-audio-file.mp3',
      };

      return HttpResponse.json(mockResponse);
    }
  ),
];
