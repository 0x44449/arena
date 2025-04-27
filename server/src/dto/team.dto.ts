import { TeamEntity } from "@/entity/team.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { PublicUserDto } from "./public-user.dto";

export class TeamDto {
  @ApiProperty()
  @Expose()
  teamId: string;

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

  @ApiProperty({ type: PublicUserDto })
  @Expose()
  owner: PublicUserDto | null;

  constructor(input: Partial<TeamDto> | TeamEntity) {
    Object.assign(this, input);
  }
}