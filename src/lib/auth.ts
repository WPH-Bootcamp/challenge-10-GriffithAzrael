import { fetchAPI } from './api';

/**
 * DTO & Response types
 */

export type RegisterDto = {
  name: string;
  username?: string; // optional, bisa di-derive dari name
  email: string;
  password: string;
};

export type RegisterResponse = {
  id: number;
  email: string;
  username: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

/**
 * POST /auth/register
 */
export async function registerUser(
  payload: RegisterDto,
): Promise<RegisterResponse> {
  return fetchAPI<RegisterResponse>('/auth/register', {
    method: 'POST',
    data: payload,
  });
}

/**
 * POST /auth/login
 */
export async function loginUser(payload: LoginDto): Promise<LoginResponse> {
  return fetchAPI<LoginResponse>('/auth/login', {
    method: 'POST',
    data: payload,
  });
}