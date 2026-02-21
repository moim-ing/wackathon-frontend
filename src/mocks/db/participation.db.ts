import type { VerifyParticipationResponse } from '@/types/participation';

// Mock DB for participation (출석 증명 데이터베이스)
// 참여(participation) 도메인은 주로 세션에 귀속되지만, 파일 분리를 위해 별도 DB 사용.
export const participationDB: VerifyParticipationResponse[] = [];
