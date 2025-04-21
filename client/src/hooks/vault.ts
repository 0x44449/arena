import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getVault, getVaults } from "@/api/vault";
import { Vault } from "@/types/api";

export function useVaultsQuery() {
  return useQuery({
    queryKey: ["vaults"],
    queryFn: getVaults,
  })
}

export function useValutQueryById(vaultId: string | undefined) {
  return useQuery({
    queryKey: ["vaults", vaultId],
    queryFn: () => {
      if (!vaultId) throw new Error("vaultId is required");
      return getVault(vaultId).then((vault) => {
        if (!vault) throw new Error("Vault not found");
        return vault;
      });
    },
    enabled: !!vaultId,
  });
}

export function useCachedVault(vaultId: string | undefined) {
  const queryClient = useQueryClient();

  const allVaults = queryClient.getQueryData<Vault[]>(['vaults']);
  return allVaults?.find((o) => o.vaultId === vaultId);
}
