import { UserEntity } from "@/entities/user.entity";
import { SupabasePayload } from "./supabase.jwt";

export default interface ArenaWebCredential {
  user: UserEntity | null;
  payload: SupabasePayload;
}