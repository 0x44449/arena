import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { TeamEntity } from "./team.entity";

@Entity('Workspace')
export class WorkspaceEntity {
  @PrimaryColumn({ name: 'WorkspaceId' })
  workspaceId: string;

  @Column({ name: 'Name' })
  name: string;

  @Column({ name: 'Description' })
  description: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'OwnerId' })
  owner: UserEntity;

  @Column({ name: 'OwnerId' })
  ownerId: string;

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'TeamId' })
  team: TeamEntity;

  @Column({ name: 'TeamId' })
  teamId: string;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamptz', nullable: true })
  updatedAt: Date;
}