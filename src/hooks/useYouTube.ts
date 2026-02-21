import { getYouTubeInfo } from '@/utils/youtube';
import { useQuery } from '@tanstack/react-query';

export function useYouTubeVideo(videoId: string) {
  return useQuery({
    queryKey: ['youtube', videoId],
    queryFn: () => getYouTubeInfo(videoId),
    enabled: !!videoId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
