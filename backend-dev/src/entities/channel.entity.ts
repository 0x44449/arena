import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { TeamEntity } from "./team.entity";
import { UserEntity } from "./user.entity";

@Entity("Channel")
export class ChannelEntity {
  @PrimaryColumn({ name: "ChannelId" })
  channelId: string;

  @Column({ name: "Name" })
  name: string;

  @Column("text", { name: "Description" })
  description: string;

  @Column({ name: "TeamId" })
  teamId: string;

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: "TeamId" })
  team: TeamEntity;

  @Column({ name: "OwnerId" })
  ownerId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "OwnerId" })
  owner: UserEntity;

  @CreateDateColumn({ name: "CreatedAt", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "UpdatedAt", type: "timestamptz", nullable: true })
  updatedAt: Date;
}