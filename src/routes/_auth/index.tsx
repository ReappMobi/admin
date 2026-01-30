import { useAuthStore } from '@/store/auth.store';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Settings } from 'lucide-react';

export const Route = createFileRoute('/_auth/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { getUser } = useAuthStore();
  return (
    <main className="px-4 py-2 flex-1 h-full">
      <div className="flex flex-col w-full p-4 gap-4 justify-center border-2 border-dashed border-gray-300 rounded-lg max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold">Olá {getUser()?.name}</h1>
          <p>Bem-vindo ao painel do administrador!</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold">Ações</p>
          <hr className="my-2" />
        </div>

        <div>
          <Link
            to="/institutions"
            className="text-sm max-w-xs text-center font-semibold bg-green-700/80 text-white px-4 py-2 rounded flex flex-row items-center justify-center gap-2 hover:bg-green-700/90 transition-colors"
          >
            <Settings />
            Gerenciar Instituições
          </Link>
        </div>
      </div>
    </main>
  );
}
