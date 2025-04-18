import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getZones } from '@/api/zone';
import { Zone } from '@/types/api';

export function useZoneQuery(vaultId: string | undefined) {
  return useQuery({
    queryKey: ['vaults', vaultId],
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
      return getZones(vaultId).then((zones) => zones.find((zone) => zone.zoneId === zoneId));
    },
    enabled: !!vaultId && !!zoneId,
  });
}
