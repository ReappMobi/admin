import { LoginForm, type LoginFormValues } from '@/components/login-form';
import { loginMutation } from '@/service/auth/requests';
import { useAuthStore } from '@/store/auth.store';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { z } from 'zod';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

const fallback = '/' as const;

export const Route = createFileRoute('/(public)/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad({ context: { auth }, search }) {
    const redirectTo = search.redirect || fallback;
    if (auth?.isLogged()) {
      throw redirect({ to: redirectTo });
    }
  },
  component: Page,
});

function Page() {
  const auth = useAuthStore();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const { mutate: login, isPending: isLoading } = loginMutation();

  const handleSubmit = async (data: LoginFormValues) => {
    login(data, {
      onSuccess: (data) => {
        auth.login(data.token);

        const redirectTo = search.redirect || fallback;
        navigate({ to: redirectTo });
      },
      onError: (error) => {
        if ((error as AxiosError)?.response?.status === 401) {
          toast.error('Email ou senha inválidos');
          return;
        }
        toast.error('Erro ao fazer login');
      },
    });
  };

  return (
    <main className="h-screen w-full flex items-center justify-center">
      <LoginForm
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        className="max-w-sm w-full"
      />
      <Toaster />
    </main>
  );
}
