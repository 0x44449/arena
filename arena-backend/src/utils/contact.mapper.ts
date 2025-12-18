import { ContactEntity } from "src/entities/contact.entity";
import { ContactDto } from "src/dtos/contact.dto";
import { UserDto } from "src/dtos/user.dto";

export function toContactDto(
  entity: ContactEntity,
  userDto: UserDto,
): ContactDto {
  return {
    user: userDto,
    createdAt: entity.createdAt,
  };
}
