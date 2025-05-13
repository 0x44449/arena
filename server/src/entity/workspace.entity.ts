import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('Workspace')
export class WorkspaceEntity {
  @PrimaryColumn({ name: 'WorkspaceId' })
  workspaceId: string;

  @Column({ name: 'TeamId' })
  teamId: string;

  @Column({ name: 'Name' })
  name: string;

  @Column('text', { name: 'Description' })
  description: string;

  @Column({ name: 'OwnerId' })
  ownerId: string;

  @Column({ name: 'DefaultFeatureId', nullable: true })
  defaultFeatureId: string;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamptz', nullable: true })
  updatedAt: Date;
}