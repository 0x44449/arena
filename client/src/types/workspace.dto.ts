import PublicUserDto from "./public-user.dto";
import WorkspaceFeatureDto from "./workspace-feature.dto";

export default interface WorkspaceDto {
  workspaceId: string;
  teamId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  owner: PublicUserDto | null;
  defaultFeatureId: string;
  features: WorkspaceFeatureDto[];
}