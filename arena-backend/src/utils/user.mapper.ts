import { UserEntity } from "src/entities/user.entity";
import { UserDto } from "src/dtos/user.dto";

export function toUserDto(entity: UserEntity): UserDto {
  const s3PublicUrl = process.env.S3_PUBLIC_URL || "http://localhost:14566/arena-files-public";
  
  const avatarUrl = entity.avatarKey
    ? `${s3PublicUrl}/${entity.avatarKey}`
    : null;
  
  return {
    utag: entity.utag,
    nick: entity.nick,
    avatarUrl,
    email: entity.email,
    statusMessage: entity.statusMessage,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
