import { columns } from '@/components/donations/columns';
import { DonationsTable } from '@/components/donations/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllDonations } from '@/service/donation/requests';
import { createFileRoute } from '@tanstack/react-router';
import { Loader } from 'lucide-react';

export const Route = createFileRoute('/_auth/donations')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: donations, isLoading } = useGetAllDonations();

  return (
    <div className="w-full">
      <div className="max-w-screen-lg mx-auto">
        <div className="my-4">
          <h1 className="text-2xl font-bold">Doações</h1>
          <p className="text-sm text-muted-foreground">
            Visualize o histórico de doações.
          </p>
        </div>

        {isLoading ? (
          <div className="relative">
            <Skeleton className="h-96 relative" />
            <Loader className="motion-safe:animate-spin absolute top-1/2 right-1/2" />
          </div>
        ) : (
          <DonationsTable columns={columns} data={donations || []} />
        )}
      </div>
    </div>
  );
}
