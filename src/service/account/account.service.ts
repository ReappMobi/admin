import { backend } from '@/lib/backend';
import { type Account, type AccountStatus, AccountType } from '@/types/account';

type GetInstitutionsParams = {
  token: string | null;
  status?: string;
};

type PutAccountStatusParams = {
  token: string | null;
  accountId: number;
  status: AccountStatus;
};

export const getInstitutionsAccounts = async ({
  token,
  ...params
}: GetInstitutionsParams) => {
  const response = await backend.get<Account[]>('/account', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      type: AccountType.INSTITUTION,
      ...params,
    },
  });
  return response.data;
};

export const updateAccountStatus = async ({
  token,
  accountId,
  status,
}: PutAccountStatusParams) => {
  const response = await backend.put<Account>(
    `/account/${accountId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
