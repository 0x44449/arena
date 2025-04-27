import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity('WorkspaceFeature')
export class WorkspaceFeatureEntity {
  @PrimaryColumn({ name: 'FeatureId' })
  featureId: string;

  @PrimaryColumn({ name: 'WorkspaceId' })
  workspaceId: string;

  @Column({ name: 'FeatureType' })
  featureType: string;

  @Column({ name: 'Order' })
  order: number;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;
}