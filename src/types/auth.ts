// ---------- /signup ----------

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  token: string;
}

// ---------- /login ----------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// ---------- /logout ----------

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LogoutRequest {}

// 204 No Content
export type LogoutResponse = void;
