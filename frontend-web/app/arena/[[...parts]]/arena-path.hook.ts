import { useParams } from "next/navigation";

export function useArenaPath() {
  const { parts } = useParams<{ parts?: string[] }>();
  const [teamId, workspaceId] = parts ?? [];

  if (parts && parts.length > 2) {
    throw new Error("Invalid URL structure. Expected format: /arena/[teamId]/[workspaceId]");
  }

  return { teamId, workspaceId };
}