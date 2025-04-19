import type { LoginFormValues } from '@/components/login-form';
import { backend } from '@/lib/backend';
import type { AuthLoginResponse } from './types';

export const login = async (loginData: LoginFormValues) => {
  const { data } = await backend.post<AuthLoginResponse>('auth/login', {
    ...loginData,
  });

  return data;
};
