import apiClient from '@/api/apiClient';
import type {
  VerifyParticipationRequest,
  VerifyParticipationResponse,
} from '@/types/participation';

// 오디오 파일로 출석 증명 (POST /api/participation/verify)
export async function verifyParticipation(
  data: VerifyParticipationRequest
): Promise<VerifyParticipationResponse> {
  const response = await apiClient.post('/participation/verify', data);
  return response.data;
}
