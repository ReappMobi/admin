import { backend } from '@/lib/backend';
import type { Donation } from '@/types/donation';
import type { PaginatedResponse } from '@/types/paginated.response';

type GetAllDonationsParams = {
  offset?: number;
  limit?: number;
};

export const getAllDonations = async ({
  offset = 0,
  limit = 100,
}: GetAllDonationsParams = {}): Promise<PaginatedResponse<Donation>> => {
  const { data } = await backend.get<PaginatedResponse<Donation>>(
    '/donation/all',
    {
      params: {
        offset,
        limit,
      },
    },
  );
  return data;
};
