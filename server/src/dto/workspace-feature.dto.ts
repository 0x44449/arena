import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class WorkspaceFeatureDto {
  @ApiProperty()
  @Expose()
  workspaceId: string;

  @ApiProperty()
  @Expose()
  featureId: string;

  @ApiProperty()
  @Expose()
  featureType: string;

  @ApiProperty()
  @Expose()
  order: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  constructor(input: Partial<WorkspaceFeatureDto>) {
    Object.assign(this, input);
  }
}