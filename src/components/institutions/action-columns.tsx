import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Account, AccountStatus } from '@/types/account';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { useUpdateAccountStatus } from '@/service/account/requests';
import { useAuthStore } from '@/store/auth.store';

export type Institutions = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

export const activeActions: ColumnDef<Account>[] = [
  {
    id: 'actions',
    header: 'Ações',
    enableHiding: false,
    cell: ({ row }) => {
      const { token } = useAuthStore();
      const { id } = row.original;
      const { mutate: updateStatus, isPending } = useUpdateAccountStatus(id);

      const handleChangeStatus = (newStatus: AccountStatus) => {
        updateStatus({
          token,
          accountId: id,
          status: newStatus,
        });
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 cursor-pointer p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="w-full cursor-pointer text-left"
              asChild
            >
              <Button
                variant={'ghost'}
                onClick={() => handleChangeStatus(AccountStatus.SUSPENDED)}
                disabled={isPending}
              >
                Suspender instituição
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="w-full cursor-pointer text-left"
              asChild
            >
              <Button
                variant={'ghost'}
                onClick={() => handleChangeStatus(AccountStatus.BANNED)}
                disabled={isPending}
              >
                Banir instituição
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="w-full cursor-pointer text-left"
              asChild
            >
              <Button
                variant={'ghost'}
                onClick={() => handleChangeStatus(AccountStatus.PENDING)}
                disabled={isPending}
              >
                Revogar aprovação
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const pendingActions: ColumnDef<Account>[] = [
  {
    id: 'actions',
    header: 'Ações',
    enableHiding: false,
    cell: ({ row }) => {
      const { token } = useAuthStore();
      const { id } = row.original;
      const { mutate: updateStatus, isPending } = useUpdateAccountStatus(id);

      const handleChangeStatus = (newStatus: AccountStatus) => {
        updateStatus({
          token,
          accountId: id,
          status: newStatus,
        });
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 cursor-pointer p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="w-full cursor-pointer text-left"
              asChild
            >
              <Button
                variant={'ghost'}
                onClick={() => handleChangeStatus(AccountStatus.ACTIVE)}
                disabled={isPending}
              >
                Aprovar
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="w-full cursor-pointer text-left"
              asChild
            >
              <Button
                variant={'ghost'}
                onClick={() => handleChangeStatus(AccountStatus.SUSPENDED)}
                disabled={isPending}
              >
                Reprovar
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const suspendedActions: ColumnDef<Account>[] = [
  {
    id: 'actions',
    header: 'Ações',
    enableHiding: false,
    cell: ({ row }) => {
      const { token } = useAuthStore();
      const { id } = row.original;
      const { mutate: updateStatus, isPending } = useUpdateAccountStatus(id);

      const handleChangeStatus = (newStatus: AccountStatus) => {
        updateStatus({
          token,
          accountId: id,
          status: newStatus,
        });
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 cursor-pointer p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="w-full cursor-pointer text-left"
              asChild
            >
              <Button
                variant={'ghost'}
                onClick={() => handleChangeStatus(AccountStatus.ACTIVE)}
                disabled={isPending}
              >
                Revogar suspensão
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="w-full cursor-pointer text-left"
              asChild
            >
              <Button
                variant={'ghost'}
                onClick={() => handleChangeStatus(AccountStatus.BANNED)}
                disabled={isPending}
              >
                Banir instituição
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
