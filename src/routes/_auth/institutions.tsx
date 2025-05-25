import { columns } from '@/components/institutions/columns';
import { InstitutionsTable } from '@/components/institutions/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetInstitutionsAccounts } from '@/service/account/requests';
import { useAuthStore } from '@/store/auth.store';
import { Skeleton } from '@/components/ui/skeleton';
import { createFileRoute } from '@tanstack/react-router';
import { Loader } from 'lucide-react';
import { AccountStatus } from '@/types/account';
import {
  activeActions,
  pendingActions,
  suspendedActions,
} from '@/components/institutions/action-columns';

export const Route = createFileRoute('/_auth/institutions')({
  component: RouteComponent,
});

type InstitutionsTableProps = {
  token: string | null;
};

function RegisteredInstitutionsTable({ token }: InstitutionsTableProps) {
  const { data: institutions, isLoading } = useGetInstitutionsAccounts({
    token,
    status: AccountStatus.ACTIVE,
  });
  return (
    <TabsContent value="registered">
      {isLoading ? (
        <div className="relative">
          <Skeleton className="h-96 relative" />
          <Loader className="motion-safe:animate-spin absolute top-1/2 right-1/2" />
        </div>
      ) : (
        <InstitutionsTable
          columns={[...columns, ...activeActions]}
          data={institutions || []}
        />
      )}
    </TabsContent>
  );
}

function PendingInstitutionsTable({ token }: InstitutionsTableProps) {
  const { data: institutions, isLoading } = useGetInstitutionsAccounts({
    token,
    status: AccountStatus.PENDING,
  });
  return (
    <TabsContent value="pending">
      {isLoading ? (
        <div className="relative">
          <Skeleton className="h-96 relative" />
          <Loader className="motion-safe:animate-spin absolute top-1/2 right-1/2" />
        </div>
      ) : (
        <InstitutionsTable
          columns={[...columns, ...pendingActions]}
          data={institutions || []}
        />
      )}
    </TabsContent>
  );
}
function SupendedInstitutionsTable({ token }: InstitutionsTableProps) {
  const { data: institutions, isLoading } = useGetInstitutionsAccounts({
    token,
    status: AccountStatus.SUSPENDED,
  });
  return (
    <TabsContent value="suspended">
      {isLoading ? (
        <div className="relative">
          <Skeleton className="h-96 relative" />
          <Loader className="motion-safe:animate-spin absolute top-1/2 right-1/2" />
        </div>
      ) : (
        <InstitutionsTable
          columns={[...columns, ...suspendedActions]}
          data={institutions || []}
        />
      )}
    </TabsContent>
  );
}

function RouteComponent() {
  const { token } = useAuthStore();

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Instituições</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie as instituições do app.
        </p>
      </div>
      <Tabs defaultValue="registered" className="max-w-screen-lg">
        <TabsList>
          <TabsTrigger value="registered" className="cursor-pointer">
            Cadastradas
          </TabsTrigger>
          <TabsTrigger value="pending" className="cursor-pointer">
            Pendentes
          </TabsTrigger>
          <TabsTrigger value="suspended" className="cursor-pointer">
            Suspensas
          </TabsTrigger>
        </TabsList>
        <RegisteredInstitutionsTable token={token} />
        <PendingInstitutionsTable token={token} />
        <SupendedInstitutionsTable token={token} />
      </Tabs>
    </div>
  );
}
