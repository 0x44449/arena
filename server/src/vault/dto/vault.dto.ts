import { PublicUserDto } from "@/user/dto/public-user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Vault } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

export class VaultDto {
  @ApiProperty()
  @Expose()
  vaultId: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @Exclude()
  ownerId: string;

  @ApiProperty({ type: PublicUserDto})
  @Expose()
  owner: PublicUserDto | null;

  constructor(input: Partial<VaultDto> | Vault) {
    Object.assign(this, input);
  }
}