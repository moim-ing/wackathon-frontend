import type { ApiErrorResponse } from '@/types/index';
import type {
  VerifyParticipationRequest,
  VerifyParticipationResponse,
} from '@/types/participation';
import { http, HttpResponse, delay } from 'msw';
import { participationDB } from '../db/participation.db';
import { path } from '../utils';

export const participationHandlers = [
  // 1. 학생 출석체크 (오디오 파일) 요청
  http.post<
    never,
    VerifyParticipationRequest,
    VerifyParticipationResponse | ApiErrorResponse
  >(path('/participation/verify'), async ({ request }) => {
    const { audioFile } = await request.json();

    // 실제 서비스라면 audioFile을 가지고 음원을 판별하는 로직이 서버에 존재
    if (audioFile) {
      await delay(800);

      const mockResponse: VerifyParticipationResponse = {
        id: '1',
        title: '알고리즘',
        sessionId: '1',
        sessionTitle: '1주차',
        videoId: 'hHHQ4bNhwjU',
        verifiedAt: new Date().toISOString(),
      };

      participationDB.push(mockResponse);

      return HttpResponse.json(mockResponse);
    }

    return HttpResponse.json(
      {
        httpStatusCode: 'BAD_REQUEST',
        title: '오디오 오류',
        message: 'Wrong guest audio',
      } as ApiErrorResponse,
      { status: 400 }
    );
  }),
];
