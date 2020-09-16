export interface LoginRequest {
  uuid: string;
  location: string;
}

export interface LoginResponse {
  uuid: string;
  username: string;
  password: string;
}
