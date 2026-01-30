import type { AccountStatus } from '@/types/account';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getInstitutionsAccounts,
  updateAccountStatus,
} from './account.service';

type UseGetInstitutionsParams = {
  token: string | null;
  status?: AccountStatus;
};

type UseUpdateAccountStatusParams = {
  token: string | null;
  accountId: number;
  status: AccountStatus;
};

export const useGetInstitutionsAccounts = ({
  token,
  ...params
}: UseGetInstitutionsParams) =>
  useQuery({
    queryKey: ['institutions', { params }],
    queryFn: () => getInstitutionsAccounts({ token, ...params }),
    enabled: !!token,
  });

export const useUpdateAccountStatus = (accountId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['accountStatus', accountId],
    mutationFn: ({ token, accountId, status }: UseUpdateAccountStatusParams) =>
      updateAccountStatus({ token, accountId, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['institutions'],
      });
    },
  });
};
