import { useAuthStore } from '@/store/auth.store';
import type { AccountStatus } from '@/types/account';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getDonorsAccounts,
  getInstitutionsAccounts,
  updateAccountStatus,
} from './account.service';

type UseGetInstitutionsParams = {
  status?: AccountStatus;
};

type UseGetDonorsParams = {
  status?: AccountStatus;
};

type UseUpdateAccountStatusParams = {
  accountId: number;
  status: AccountStatus;
};

export const useGetInstitutionsAccounts = (
  params?: UseGetInstitutionsParams,
) => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ['institutions', { params }],
    queryFn: () => getInstitutionsAccounts(params || {}),
    enabled: !!token,
  });
};

export const useGetDonorsAccounts = (params?: UseGetDonorsParams) => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ['donors', { params }],
    queryFn: () => getDonorsAccounts(params || {}),
    enabled: !!token,
  });
};

export const useUpdateAccountStatus = (accountId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['accountStatus', accountId],
    mutationFn: ({ accountId, status }: UseUpdateAccountStatusParams) =>
      updateAccountStatus({ accountId, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['institutions'],
      });
    },
  });
};
