import type { Donation } from '@/types/donation';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Donation>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: 'donorName',
    header: 'Doador',
    accessorFn: (row) => row.donor?.account.name || 'Anônimo',
  },
  {
    accessorKey: 'amount',
    header: 'Valor',
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      const variant =
        status === 'APPROVED'
          ? 'default'
          : status === 'PENDING'
            ? 'secondary'
            : 'destructive';

      const statusClasses: Record<string, string> = {
        APPROVED:
          'bg-green-600 hover:bg-green-600/90 text-white border-transparent',
      };

      const labelMap: Record<string, string> = {
        APPROVED: 'Aprovado',
        PENDING: 'Pendente',
        CANCELED: 'Cancelado',
        REJECTED: 'Rejeitado',
      };

      return (
        <Badge variant={variant} className={statusClasses[status]}>
          {labelMap[status] || status}
        </Badge>
      );
    },
  },
  {
    id: 'destination',
    header: 'Destino',
    cell: ({ row }) => {
      const donation = row.original;
      if (donation.project) {
        return <span>Proj: {donation.project.name}</span>;
      }
      if (donation.institution) {
        return <span>Inst: {donation.institution.account.name}</span>;
      }
      return <span>Geral</span>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Data',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleDateString('pt-BR');
    },
  },
];
