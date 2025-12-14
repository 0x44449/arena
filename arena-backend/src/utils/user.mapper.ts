import { UserEntity } from "src/entities/user.entity";
import { UserDto } from "src/dtos/user.dto";

export function toUserDto(entity: UserEntity): UserDto {
  const serverUrl = process.env.SERVER_URL || "http://localhost:8002";
  
  return {
    utag: entity.utag,
    nick: entity.nick,
    avatarUrl: `${serverUrl}/api/v1/files/avatar/${entity.utag}`,
    email: entity.email,
    statusMessage: entity.statusMessage,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
