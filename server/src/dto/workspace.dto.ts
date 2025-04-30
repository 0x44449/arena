import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { PublicUserDto } from "./public-user.dto";
import { WorkspaceEntity } from "@/entity/workspace.entity";
import { WorkspaceFeatureDto } from "./workspace-feature.dto";

export class WorkspaceDto {
  @ApiProperty()
  @Expose()
  workspaceId: string;

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
  owerId: string;

  @ApiProperty({ type: PublicUserDto })
  @Expose()
  owner: PublicUserDto | null;

  @ApiProperty()
  @Expose()
  defaultFeatureId: string;

  @ApiProperty({ type: [WorkspaceFeatureDto] })
  @Expose()
  features: WorkspaceFeatureDto[];

  constructor(input: Partial<WorkspaceDto> | WorkspaceEntity) {
    Object.assign(this, input);
  }
}