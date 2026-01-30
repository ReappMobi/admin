import {
  activeActions,
  pendingActions,
  suspendedActions,
} from '@/components/institutions/action-columns';
import { columns } from '@/components/institutions/columns';
import { InstitutionsTable } from '@/components/institutions/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetInstitutionsAccounts } from '@/service/account/requests';
import { AccountStatus } from '@/types/account';
import { createFileRoute } from '@tanstack/react-router';
import { Loader } from 'lucide-react';

export const Route = createFileRoute('/_auth/institutions')({
  component: RouteComponent,
});

function RegisteredInstitutionsTable() {
  const { data: institutions, isLoading } = useGetInstitutionsAccounts({
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

function PendingInstitutionsTable() {
  const { data: institutions, isLoading } = useGetInstitutionsAccounts({
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
function SupendedInstitutionsTable() {
  const { data: institutions, isLoading } = useGetInstitutionsAccounts({
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
  return (
    <div className="w-full">
      <div className="max-w-screen-lg mx-auto">
        <div className="my-4">
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
          <RegisteredInstitutionsTable />
          <PendingInstitutionsTable />
          <SupendedInstitutionsTable />
        </Tabs>
      </div>
    </div>
  );
}
