import { TeamEntity } from "@/entity/team.entity";
import { Exclude } from "class-transformer";
import { PublicUserDto } from "./public-user.dto";

export class TeamDto {
  teamId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  ownerId: string;

  owner: PublicUserDto | null;

  constructor(input: Partial<TeamDto> | TeamEntity) {
    Object.assign(this, input);
  }
}