import { columns } from '@/components/donations/columns';
import { DonationsTable } from '@/components/donations/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllDonations } from '@/service/donation/donation.service';
import { createFileRoute } from '@tanstack/react-router';
import type { PaginationState, Updater } from '@tanstack/react-table';
import { Loader } from 'lucide-react';
import { z } from 'zod';

const donationsSearchSchema = z.object({
  page: z.coerce.number().catch(1).optional(),
  pageSize: z.coerce.number().catch(10).optional(),
});

export const Route = createFileRoute('/_auth/donations')({
  validateSearch: donationsSearchSchema,
  component: RouteComponent,
});

const BUFFER_PAGES = 5;

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const pagination: PaginationState = {
    pageIndex: (search.page ?? 1) - 1,
    pageSize: search.pageSize ?? 10,
  };

  const bufferIndex = Math.floor(pagination.pageIndex / BUFFER_PAGES);
  const fetchLimit = pagination.pageSize * BUFFER_PAGES;
  const fetchOffset = bufferIndex * fetchLimit;

  const { data: donationsResponse, isLoading } = useGetAllDonations({
    offset: fetchOffset,
    limit: fetchLimit,
  });

  const allBufferedData = donationsResponse?.data || [];
  const rowCount = donationsResponse?.meta.total || 0;

  const relativePageIndex = pagination.pageIndex % BUFFER_PAGES;
  const sliceStart = relativePageIndex * pagination.pageSize;
  const sliceEnd = sliceStart + pagination.pageSize;

  const donations = allBufferedData.slice(sliceStart, sliceEnd);

  const setPagination = (updaterOrValue: Updater<PaginationState>) => {
    const newPagination =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(pagination)
        : updaterOrValue;
    navigate({
      search: (prev) => ({
        ...prev,
        page: newPagination.pageIndex + 1,
        pageSize: newPagination.pageSize,
      }),
    });
  };

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
          <DonationsTable
            columns={columns}
            data={donations}
            rowCount={rowCount}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        )}
      </div>
    </div>
  );
}
