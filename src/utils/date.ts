/**
 * ISO Date String을 한국 시간 기준 "YYYY년 MM월 DD일" 형식으로 변환합니다.
 * @param isoDate ISO Date String (e.g., "2026-02-02T20:00:00Z")
 * @returns "YYYY년 MM월 DD일" 형식의 문자열
 */
export function formatDate(isoDate?: string): string {
  const date = isoDate ? new Date(isoDate) : new Date();
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
