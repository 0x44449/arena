import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

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

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamptz', nullable: true })
  updatedAt: Date;
}