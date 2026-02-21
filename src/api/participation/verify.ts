import apiClient from '@/api/apiClient';
import type {
  VerifyParticipationRequest,
  VerifyParticipationResponse,
} from '@/types/participation';

// 오디오 파일로 출석 증명 (POST /api/participation/verify)
export async function verifyParticipation(
  data: VerifyParticipationRequest
): Promise<VerifyParticipationResponse> {
  const formData = new FormData();
  formData.append('audioFile', data.audioFile);
  formData.append('recordedAt', String(data.recordedAt));

  const response = await apiClient.post('/participation/verify', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
