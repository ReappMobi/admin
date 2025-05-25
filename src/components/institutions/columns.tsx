import { type Account, AccountStatus } from '@/types/account';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';

const statusMap = {
  [AccountStatus.ACTIVE]: 'Ativo',
  [AccountStatus.PENDING]: 'Pendente',
  [AccountStatus.SUSPENDED]: 'Suspenso',
  [AccountStatus.BANNED]: 'Banido',
  [AccountStatus.INACTIVE]: 'Inativo',
};

export type Institutions = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: 'id',
    id: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'institution.category.name',
    header: 'Categoria',
  },
  {
    accessorKey: 'institution.cnpj',
    header: 'CNPJ',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <span className="text-xs">{value}</span>;
    },
  },
  {
    accessorKey: 'followersCount',
    header: 'Seguidores',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as AccountStatus;
      return (
        <Badge variant={'outline'} className="text-xs capitalize">
          {statusMap[status]}
        </Badge>
      );
    },
  },
];
