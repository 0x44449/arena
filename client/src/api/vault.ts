import api from "@/lib/api";
import { Vault, Zone } from "@/types/api";

export async function getVaults(): Promise<Vault[]> {
  const response = await api.get<Vault[]>("/api/v1/vaults");
  return response.data;
}

export async function getVault(vaultId: string): Promise<Vault> {
  const response = await api.get<Vault>(`/api/v1/vaults/${vaultId}`);
  return response.data;
}

export async function getZones(vaultId: string): Promise<Zone[]> {
  const response = await api.get<Zone[]>(`/api/v1/vaults/${vaultId}/zones`);
  return response.data;
}

export async function getZone(vaultId: string, zoneId: string): Promise<Zone> {
  const response = await api.get<Zone>(`/api/v1/vaults/${vaultId}/zones/${zoneId}`);
  return response.data;
}