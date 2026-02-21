import apiClient from '@/api/apiClient';
import type {
  CreateClassRequest,
  CreateClassResponse,
  GetClassResponse,
} from '@/types/classes';

// 새 클래스 생성 (POST /api/classes)
export async function createClass(
  data: CreateClassRequest
): Promise<CreateClassResponse> {
  const response = await apiClient.post('/classes', data);
  return response.data;
}

// 클래스 정보 조회 (GET /api/classes/:id)
export async function getClass(id: string): Promise<GetClassResponse> {
  const response = await apiClient.get(`/classes/${id}`);
  return response.data;
}
