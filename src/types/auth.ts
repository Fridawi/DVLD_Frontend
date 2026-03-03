export interface LoginRequest {
  userName: string;
  password: string;
}

export interface AuthResponse {
  isAuthenticated: boolean;
  message: string;
  token: string;
  expiresOn: string;
  userID: number;
  userName: string;
  role: string;
}

export interface ApiErrorData {
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  traceId?: string;
  errors?: Record<string, string[]>;
}

export interface SerializedError {
  status: number;
  data: ApiErrorData;
}
