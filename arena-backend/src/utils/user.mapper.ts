import { UserEntity } from "src/entities/user.entity";
import { UserDto } from "src/dtos/user.dto";
import { FileDto } from "src/dtos/file.dto";

export function toUserDto(entity: UserEntity, avatar: FileDto | null): UserDto {
  return {
    utag: entity.utag,
    nick: entity.nick,
    avatar,
    email: entity.email,
    statusMessage: entity.statusMessage,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
