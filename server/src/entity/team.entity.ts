import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('Team')
export class TeamEntity {
  @PrimaryColumn({ name: 'TeamId' })
  teamId: string;

  @Column({ name: 'Name' })
  name: string;

  @Column('text', { name: 'Description' })
  description: string;

  @Column({ name: 'OwnerId' })
  ownerId: string;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamptz', nullable: true })
  updatedAt: Date;
}