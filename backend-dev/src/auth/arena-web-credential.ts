import { UserEntity } from "@/entities/user.entity";
import { JWTPayload } from "jose";

export default interface ArenaWebCredential {
  user: UserEntity | null;
  payload: JWTPayload;
}