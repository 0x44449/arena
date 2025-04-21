import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Zone } from '@/types/api';
import { getZone, getZones } from '@/api/vault';

export function useZonesQuery(vaultId: string | undefined) {
  return useQuery({
    queryKey: ['vaults', vaultId, 'zones'],
    queryFn: () => {
      if (!vaultId) throw new Error('vaultId is required');
      return getZones(vaultId);
    },
    enabled: !!vaultId,
  });
}

export function useCachedZone(vaultId: string | undefined, zoneId: string | undefined) {
  const queryClient = useQueryClient();

  const allVaults = queryClient.getQueryData<Zone[]>(['vaults', vaultId]);
  return allVaults?.find((o) => o.zoneId === zoneId);
}


export function useZoneQueryById(vaultId: string | undefined, zoneId: string | undefined) {
  return useQuery({
    queryKey: ['vaults', vaultId, 'zones', zoneId],
    queryFn: () => {
      if (!vaultId || !zoneId) throw new Error('vaultId and zoneId are required');
      return getZone(vaultId, zoneId).then((zone) => {
        if (!zone) throw new Error('Zone not found');
        return zone;
      });
    },
    enabled: !!vaultId && !!zoneId,
  });
}
