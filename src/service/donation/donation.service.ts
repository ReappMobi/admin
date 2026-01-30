import { backend } from '@/lib/backend';
import type { Donation } from '@/types/donation';

type GetAllDonationsParams = {
  page?: number;
  limit?: number;
};

export const getAllDonations = async (params: GetAllDonationsParams = {}) => {
  const finalParams = {
    page: 1,
    limit: 10,
    ...params,
  };
  const response = await backend.get<Donation[]>('/donation/all', {
    params: finalParams,
  });
  return response.data;
};
