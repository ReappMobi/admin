import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  calculateMonthlyAmountGrowth,
  calculateMonthlyGrowth,
} from '@/lib/metrics';
import {
  useGetDonorsAccounts,
  useGetInstitutionsAccounts,
} from '@/service/account/requests';
import { useGetAllDonations } from '@/service/donation/requests';
import { useAuthStore } from '@/store/auth.store';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Activity,
  ArrowRight,
  Building2,
  DollarSign,
  Users,
} from 'lucide-react';

export const Route = createFileRoute('/_auth/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { getUser } = useAuthStore();

  const { data: institutions } = useGetInstitutionsAccounts({});
  const { data: donors } = useGetDonorsAccounts({});
  const { data: donations } = useGetAllDonations({ limit: 100 }); // Fetching more to get a better sum estimation

  const allAccounts = [...(institutions || []), ...(donors || [])];
  const activityGrowth = calculateMonthlyGrowth(allAccounts);

  const approvedDonations = (donations || []).filter(
    (d) => d.status === 'APPROVED',
  );

  const donationsGrowth = calculateMonthlyAmountGrowth(approvedDonations);

  const totalDonationsAmount = approvedDonations.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0,
  );

  const formattedDonations = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalDonationsAmount);

  const stats = [
    {
      title: 'Instituições',
      value: institutions?.length || 0,
      description: 'Total de instituições cadastradas',
      icon: Building2,
      color: 'text-blue-600',
    },
    {
      title: 'Doações',
      value: formattedDonations,
      description: `${donationsGrowth > 0 ? '+' : ''}${donationsGrowth}% em relação ao mês anterior`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Usuários',
      value: donors?.length || 0,
      description: 'Total de doadores cadastrados',
      icon: Users,
      color: 'text-orange-600',
    },
    {
      title: 'Atividade',
      value: `${activityGrowth > 0 ? '+' : ''}${activityGrowth}%`,
      description: 'Crescimento total da base este mês',
      icon: Activity,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Olá, {getUser()?.name}
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel administrativo do Reapp.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={`${String(index)}-${stat}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Gerencie as principais funcionalidades do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Link
              to="/institutions"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <div className="font-medium">Gerenciar Instituições</div>
                  <p className="text-sm text-muted-foreground">
                    Ver e editar instituições
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link
              to="/donations"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <div className="font-medium">Ver Doações</div>
                  <p className="text-sm text-muted-foreground">
                    Relatório de doações
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Atualizações Recentes</CardTitle>
            <CardDescription>Últimas atividades no sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="relative flex h-2 w-2 mr-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-medium leadinsg-none">
                    Sistema iniciado
                  </p>
                  <p className="text-sm text-muted-foreground">
                    O painel está pronto para uso.
                  </p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">
                  Agora
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
