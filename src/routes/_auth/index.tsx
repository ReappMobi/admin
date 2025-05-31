import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuthStore } from '@/store/auth.store';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export const Route = createFileRoute('/_auth/')({
  component: RouteComponent,
});

const CreateCampaignDialog = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted');
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} defaultOpen={false} onOpenChange={setOpenDialog}>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button className="cursor-pointer">
            Criar campanha
            <Plus className="mr-2 h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova campanha</DialogTitle>
            <DialogDescription>
              Crie uma nova campanha para arrecadar fundos para sua instituição.
              Preencha os detalhes necessários e publique sua campanha.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Nome</Label>
              <Input id="name-1" name="name" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="picture">Imagem da campanha</Label>
              <Input id="picture" type="file" accept="image/*" required />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" className="cursor-pointer">
                Criar campanha
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

function RouteComponent() {
  const { getUser } = useAuthStore();

  const TotalRaised = ({ children }: { children?: React.ReactNode }) => {
    return (
      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
        {children}
      </CardTitle>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex lg:flex-row flex-col items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Olá, {getUser()?.name || 'Usuário'}! Bem-vindo ao painel de
            controle.
          </h1>
          <p className="text-muted-foreground mb-6">
            Aqui você pode gerenciar suas instituições, visualizar estatísticas
            e acompanhar o progresso das arrecadações.
          </p>
        </div>
        <div className="ml-auto">
          <CreateCampaignDialog />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total arrecadado</CardDescription>
            <TotalRaised>
              {(10000).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </TotalRaised>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Novos usuários</CardDescription>
            <TotalRaised>2000</TotalRaised>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total arrecadado ess mês</CardDescription>
            <TotalRaised>
              {(2000).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </TotalRaised>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Contas ativas</CardDescription>
            <TotalRaised>{2000}</TotalRaised>
          </CardHeader>
        </Card>
        {/* Render donations table */}
      </div>
    </div>
  );
}
