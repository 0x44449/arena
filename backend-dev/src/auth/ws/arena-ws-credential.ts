import { UserEntity } from "@/entities/user.entity";
import { JWTPayload } from "jose";

export default interface ArenaWsCredential {
  user: UserEntity | null;
  payload: JWTPayload;
}