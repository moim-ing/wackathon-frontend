export async function getYouTubeTitle(videoId: string): Promise<string> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch YouTube info');
    }
    const data = await response.json();
    return data.title;
  } catch (error) {
    console.error('Error fetching YouTube title:', error);
    return '알 수 없는 곡';
  }
}

export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}
