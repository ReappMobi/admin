import { backend } from '@/lib/backend';
import { type Account, type AccountStatus, AccountType } from '@/types/account';

type GetInstitutionsParams = {
  status?: string;
};

type PutAccountStatusParams = {
  accountId: number;
  status: AccountStatus;
};

export const getInstitutionsAccounts = async (
  params: GetInstitutionsParams,
) => {
  const response = await backend.get<Account[]>('/account', {
    params: {
      type: AccountType.INSTITUTION,
      ...params,
    },
  });
  return response.data;
};

export const getDonorsAccounts = async (params: GetInstitutionsParams) => {
  const response = await backend.get<Account[]>('/account', {
    params: {
      type: AccountType.DONOR,
      ...params,
    },
  });
  return response.data;
};

export const updateAccountStatus = async ({
  accountId,
  status,
}: PutAccountStatusParams) => {
  const response = await backend.put<Account>(`/account/${accountId}`, {
    status,
  });
  return response.data;
};
