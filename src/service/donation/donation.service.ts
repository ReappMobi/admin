import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAllDonations } from './donation.requests';

type UseGetAllDonationsParams = {
  offset?: number;
  limit?: number;
};

export const useGetAllDonations = (params: UseGetAllDonationsParams = {}) => {
  return useQuery({
    queryKey: ['donations', params],
    queryFn: () => getAllDonations(params),
    placeholderData: keepPreviousData,
  });
};
