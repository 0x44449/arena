import { PublicUserDto } from "@/user/dto/public-user.dto";
import { Vault } from "@prisma/client";

export class VaultDto {
  vaultId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  owner: PublicUserDto | null;

  constructor(input: Partial<VaultDto> | Vault) {
    Object.assign(this, input);
  }
}