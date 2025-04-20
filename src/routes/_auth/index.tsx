import { useAuthStore } from '@/store/auth.store';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { getUser } = useAuthStore();
  return <div>Olá {getUser()?.name}</div>;
}
