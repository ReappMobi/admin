import { useQuery } from '@tanstack/react-query';
import { getAllDonations } from './donation.service';

type UseGetAllDonationsParams = {
  page?: number;
  limit?: number;
};

export const useGetAllDonations = (params: UseGetAllDonationsParams = {}) => {
  return useQuery({
    queryKey: ['donations', params],
    queryFn: () => getAllDonations(params),
  });
};
