export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  accessToken: string;
}

export interface AuthErrorResponse {
  message?: string;
}
