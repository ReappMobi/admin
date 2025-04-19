import { useMutation } from '@tanstack/react-query';
import { login } from './auth.service';

export const loginMutation = () =>
  useMutation({
    mutationFn: login,
    mutationKey: ['login'],
  });
