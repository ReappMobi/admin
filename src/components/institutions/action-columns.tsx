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
import { useRouter } from '@tanstack/react-router';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
      const { id, name } = row.original;
      const { mutate: updateStatus, isPending } = useUpdateAccountStatus(id);

      const router = useRouter();

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
                onClick={() => handleChangeStatus(AccountStatus.PENDING)}
                disabled={isPending}
              >
                Revogar aprovação
              </Button>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="w-full cursor-pointer text-left"
            >
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={'ghost'} disabled={isPending}>
                    Banir instituição
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Banir instituição</AlertDialogTitle>
                    <AlertDialogDescription>
                      Você tem certeza que deseja banir a instituição{' '}
                      <span className="font-semibold">{name}</span> ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="cursor-pointer"
                      disabled={isPending}
                      onClick={() => {
                        handleChangeStatus(AccountStatus.BANNED);
                        router.navigate({
                          to: '/institutions',
                        });
                      }}
                    >
                      Banir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
      const { id, name } = row.original;
      const { mutate: updateStatus, isPending } = useUpdateAccountStatus(id);
      const router = useRouter();
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
              asChild
              className="w-full cursor-pointer text-left"
            >
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={'ghost'} disabled={isPending}>
                    Banir instituição
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Banir instituição</AlertDialogTitle>
                    <AlertDialogDescription>
                      Você tem certeza que deseja banir a instituição{' '}
                      <span className="font-semibold">{name}</span> ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="cursor-pointer"
                      disabled={isPending}
                      onClick={(e) => {
                        e.preventDefault();
                        handleChangeStatus(AccountStatus.BANNED);
                        router.navigate({
                          to: '/institutions',
                        });
                      }}
                    >
                      Banir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
