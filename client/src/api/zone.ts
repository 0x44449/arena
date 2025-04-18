import api from '@/lib/api';
import { Zone } from '@/types/api';

export async function getZones(outpostId: string): Promise<Zone[]> {
  const response = await api.get<Zone[]>(`/vaults/${outpostId}/zones`);
  return response.data;
}
