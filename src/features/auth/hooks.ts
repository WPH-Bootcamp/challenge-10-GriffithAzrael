'use client';

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import {
  registerUser,
  loginUser,
  type RegisterDto,
  type RegisterResponse,
  type LoginDto,
  type LoginResponse,
} from '@/lib/auth';

export function useRegisterMutation(
  options?: UseMutationOptions<RegisterResponse, Error, RegisterDto>,
) {
  return useMutation<RegisterResponse, Error, RegisterDto>({
    mutationKey: ['auth', 'register'],
    mutationFn: registerUser,
    ...options,
  });
}

export function useLoginMutation(
  options?: UseMutationOptions<LoginResponse, Error, LoginDto>,
) {
  return useMutation<LoginResponse, Error, LoginDto>({
    mutationKey: ['auth', 'login'],
    mutationFn: loginUser,
    ...options,
  });
}