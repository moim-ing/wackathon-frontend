import apiClient from '@/api/apiClient';
import type {
  VerifyParticipationRequest,
  VerifyParticipationResponse,
} from '@/types/participation';

// 오디오 파일 key로 출석 증명 (POST /api/participation/verify)
export async function verifyParticipation(
  data: VerifyParticipationRequest,
  sessionId: string
): Promise<VerifyParticipationResponse> {
  const response = await apiClient.post(
    `/participation/verify/${sessionId}`,
    data
  );
  return response.data;
}
