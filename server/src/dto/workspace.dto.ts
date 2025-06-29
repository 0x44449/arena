import { Exclude } from "class-transformer";
import { PublicUserDto } from "./public-user.dto";
import { WorkspaceEntity } from "@/entity/workspace.entity";
import { WorkspaceFeatureDto } from "./workspace-feature.dto";

export class WorkspaceDto {
  workspaceId: string;
  teamId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  owerId: string;

  owner: PublicUserDto | null;
  defaultFeatureId: string;
  features: WorkspaceFeatureDto[];

  constructor(input: Partial<WorkspaceDto> | WorkspaceEntity) {
    Object.assign(this, input);
  }
}