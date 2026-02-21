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

// 204 No Content
export type LogoutResponse = void;
