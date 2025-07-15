import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { WorkspaceEntity } from "./workspace.entity";

@Entity('Team')
export class TeamEntity {
  @PrimaryColumn({ name: 'TeamId' })
  teamId: string;

  @Column({ name: 'Name' })
  name: string;

  @Column('text', { name: 'Description' })
  description: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'OwnerId' })
  owner: UserEntity;

  @Column({ name: 'OwnerId' })
  ownerId: string;

  @OneToMany(() => WorkspaceEntity, (workspace) => workspace.team)
  workspaces: WorkspaceEntity[];

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamptz', nullable: true })
  updatedAt: Date;
}