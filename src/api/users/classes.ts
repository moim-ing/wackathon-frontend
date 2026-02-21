import apiClient from '@/api/apiClient';
import type { GetMyClassesResponse } from '@/types/users';

// 나의 클래스 조회 (GET /api/users/classes)
export async function getMyClasses(
  token?: string
): Promise<GetMyClassesResponse> {
  const headers = {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
  const response = await apiClient.get('/users/classes', headers);
  return response.data;
}
