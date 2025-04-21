import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { VaultDto } from "./dto/vault.dto";
import { UserService } from "@/user/user.service";
import { PublicUserDto } from "@/user/dto/public-user.dto";
import { CreateVaultDto } from "./dto/create-vault.dto";
import { nanoid } from "nanoid";

@Injectable()
export class VaultService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly userService: UserService
  ) {}

  async createVault(param: CreateVaultDto, ownerId: string): Promise<VaultDto> {
    const { name, description } = param;
    const vault = await this.prisma.vault.create({
      data: {
        vaultId: nanoid(12),
        name,
        description,
        ownerId,
      }
    });
    const vaultDto = new VaultDto(vault);

    // User 매핑
    const user = await this.userService.getUser(ownerId);
    if (user) {
      vaultDto.owner = new PublicUserDto(user);
    }
    return vaultDto;
  }

  async getVaults(): Promise<VaultDto[]> {
    const vaults = await this.prisma.vault.findMany();

    // User 매핑
    // TOOD: 성능개선
    const result = await Promise.all(
      vaults.map(async (vault) => {
        const user = await this.userService.getUser(vault.ownerId);

        const vaultDto = new VaultDto(vault);
        if (user) {
          vaultDto.owner = new PublicUserDto(user);
        }
        return vaultDto;
      })
    );
    return result;
  }

  async getVault(vaultId: string): Promise<VaultDto | null> {
    const vault = await this.prisma.vault.findUnique({
      where: { vaultId },
    });

    if (!vault) return null;
    // User 매핑
    const user = await this.userService.getUser(vault.ownerId);
    const vaultDto = new VaultDto(vault);
    if (user) {
      vaultDto.owner = new PublicUserDto(user);
    }
    return vaultDto;
  }
}
