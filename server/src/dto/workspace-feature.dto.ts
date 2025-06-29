export class WorkspaceFeatureDto {
  workspaceId: string;
  featureId: string;
  featureType: string;
  order: number;
  createdAt: Date;

  constructor(input: Partial<WorkspaceFeatureDto>) {
    Object.assign(this, input);
  }
}