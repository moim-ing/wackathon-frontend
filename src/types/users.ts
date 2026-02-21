import type { Class, User } from '@/types';

// ---------- GET /api/users/me ----------

export type GetMeResponse = User;

// ---------- GET /api/users/classes ----------

export interface GetMyClassesResponse {
  classes: Class[];
}
