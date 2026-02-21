import apiClient from '@/api/apiClient';
import type { SignUpRequest, SignUpResponse } from '@/types/auth';

export default async function signUp(data: SignUpRequest) {
  return await apiClient.post<SignUpResponse>('/auth/signup', data);
}
