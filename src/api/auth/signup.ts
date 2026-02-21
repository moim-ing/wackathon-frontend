import apiClient from '@/api/apiClient';
import type { SignUpRequest, SignUpResponse } from '@/types/auth';

export default async function signUp(data: SignUpRequest) {
  const response = await apiClient.post<SignUpResponse>('/auth/login', data);
  return response.data;
}
