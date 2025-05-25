import { useQuery } from "@tanstack/react-query";
import { getInstitutions } from "./institutions.service";

type UseGetInstitutionsParams = {
  token: string | null;
  status?: string;
};

export const useGetInstitutions = ({
  token,
  ...params
}: UseGetInstitutionsParams) =>
  useQuery({
    queryKey: ["institutions", { params }],
    queryFn: () => getInstitutions({ token, ...params }),
    enabled: !!token,
  });
