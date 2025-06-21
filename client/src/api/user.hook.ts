import PublicUserDto from "@/types/public-user.dto";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getMe } from "./user";

export function useMeQuery(options?: Partial<UseQueryOptions<PublicUserDto | null>>) {
  return useQuery<PublicUserDto | null, Error>({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await getMe();
      if (!response.success) {
        throw new Error("Failed to fetch user data");
      }
      return response.data;
    },
    ...options,
  });
}