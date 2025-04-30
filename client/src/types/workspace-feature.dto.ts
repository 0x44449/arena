export default interface WorkspaceFeatureDto {
  workspaceId: string;
  featureId: string;
  featureType: string;
  order: number;
  createdAt: Date;
}