import { ContactEntity } from "src/entities/contact.entity";
import { ContactDto } from "src/dtos/contact.dto";
import { toUserDto } from "./user.mapper";

export function toContactDto(entity: ContactEntity): ContactDto {
  return {
    user: toUserDto(entity.user),
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
