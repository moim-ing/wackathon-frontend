import type { ApiErrorResponse } from '@/types/index';
import type {
  VerifyParticipationRequest,
  VerifyParticipationResponse,
} from '@/types/participation';
import { http, HttpResponse, delay } from 'msw';
import { participationDB } from '../db/participation.db';
import { path } from '../utils';

export const participationHandlers = [
  // 1. 학생 출석체크 (오디오 파일 key) 요청
  http.post<
    never,
    VerifyParticipationRequest, // Change request type to VerifyParticipationRequest for MSW
    VerifyParticipationResponse | ApiErrorResponse
  >(path('/participation/verify'), async () => {
    // const { key, recordedAt } = await request.json();

    // 실제 서비스라면 audioFile을 가지고 음원을 판별하는 로직이 서버에 존재하겠지만
    // 현재는 성공 페이지를 자유롭게 볼 수 있도록 항상 성공을 반환합니다.
    await delay(100);

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
  }),
];
