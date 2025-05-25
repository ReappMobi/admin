import { backend } from "@/lib/backend";
import { AccountType, type Account } from "@/types/account";

type GetInstitutionsParams = {
  token: string | null;
  status?: string;
};

export const getInstitutions = async ({
  token,
  ...params
}: GetInstitutionsParams) => {
  const response = await backend.get<Account[]>("/account", {
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
