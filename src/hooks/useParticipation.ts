import { verifyParticipation } from '@/api/participation/verify';
import type { VerifyParticipationRequest } from '@/types/participation';
import { useMutation } from '@tanstack/react-query';

export function useVerifyParticipation() {
  return useMutation({
    mutationFn: (data: VerifyParticipationRequest) => verifyParticipation(data),
    onError: (error: Error) => {
      console.error('Failed to verify participation', error);
    },
  });
}
