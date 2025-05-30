import { zodResolver } from '@hookform/resolvers/zod';
import { Circle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';

const loginFormValidationSchema = z.object({
  email: z.string().email('Email inválido').nonempty('Campo obrigatório'),
  password: z
    .string()
    .nonempty('Campo obrigatório')
    .min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginFormValidationSchema>;

type LoginFormProps = {
  handleSubmit: (data: LoginFormValues) => void;
  isLoading?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function LoginForm({
  className,
  handleSubmit,
  isLoading,
  ...props
}: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormValidationSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reapp Admin</CardTitle>
          <CardDescription>
            Entre com sua conta para continuar...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          required
                          placeholder="Digite seu email"
                          autoComplete="email"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck="false"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 ring-green-300 cursor-pointer"
                >
                  Entrar
                  {isLoading && (
                    <Circle className="animate-spin ml-2 h-4 w-4 text-white" />
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
