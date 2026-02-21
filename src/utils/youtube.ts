export interface YouTubeVideoInfo {
  title: string;
  authorName: string;
}

export async function getYouTubeInfo(
  videoId: string
): Promise<YouTubeVideoInfo> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch YouTube info');
    }
    const data = await response.json();
    return {
      title: data.title,
      authorName: data.author_name,
    };
  } catch (error) {
    console.error('Error fetching YouTube info:', error);
    return {
      title: '알 수 없는 곡',
      authorName: '알 수 없는 업로더',
    };
  }
}

export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}
