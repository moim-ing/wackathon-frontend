// ---------- POST /api/participation/verify ----------

export interface VerifyParticipationRequest {
  audioFile: Blob | File;
  recordedAt: number;
}

export interface VerifyParticipationResponse {
  id: string; // classId
  title: string; // class 이름
  sessionId: string;
  sessionTitle: string;
  videoId: string;
  verifiedAt: string;
}
