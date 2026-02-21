import { getFile, uploadFile } from '@/api/file';
import { useMutation, useQuery } from '@tanstack/react-query';

// 파일 업로드 (audio)
export function useUploadFile() {
  return useMutation({
    mutationFn: ({ file, prefix }: { file: Blob | File; prefix?: string }) =>
      uploadFile(file, prefix),
  });
}

// 세션 아이디로 파일 정보 조회
export function useGetFile(sessionId: string) {
  return useQuery({
    queryKey: ['file', sessionId],
    queryFn: () => getFile(sessionId),
    enabled: !!sessionId,
  });
}
