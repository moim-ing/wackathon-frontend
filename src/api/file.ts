import apiClient from '@/api/apiClient';
import type { GetFileResponse, UploadFileResponse } from '@/types/file';

// 1. 파일 업로드 (POST /api/file)
export async function uploadFile(
  file: Blob | File,
  prefix: string = 'audio'
): Promise<UploadFileResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/file', formData, {
    params: { prefix },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// 2. 파일 정보 조회 (GET /api/file/{sessionId})
export async function getFile(sessionId: string): Promise<GetFileResponse> {
  const response = await apiClient.get(`/file/${sessionId}`);
  return response.data;
}
