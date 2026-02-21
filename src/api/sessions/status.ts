import apiClient from '@/api/apiClient';
import type {
  PatchSessionStatusRequest,
  PatchSessionStatusResponse,
} from '@/types/sessions';

// 음악 상태 변경 (PATCH /api/classes/{id}/sessions/{sessionId}/status)
export async function patchSessionStatus(
  classId: string,
  sessionId: string,
  data: PatchSessionStatusRequest
): Promise<PatchSessionStatusResponse> {
  const response = await apiClient.patch(
    `/classes/${classId}/sessions/${sessionId}/status`,
    data
  );
  return response.data;
}
