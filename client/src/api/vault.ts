import api from "@/lib/api";
import { Vault } from "@/types/api";

export async function getVaults(): Promise<Vault[]> {
  const response = await api.get<Vault[]>("/vaults");
  return response.data;
}
