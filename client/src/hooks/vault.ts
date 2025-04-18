import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getVaults } from "@/api/vault";
import { Vault } from "@/types/api";

export function useVaultsQuery() {
  return useQuery({
    queryKey: ["vaults"],
    queryFn: getVaults,
  })
}

export function useCachedVault(vaultId: string | undefined) {
  const queryClient = useQueryClient();

  const allVaults = queryClient.getQueryData<Vault[]>(['vaults']);
  return allVaults?.find((o) => o.vaultId === vaultId);
}
