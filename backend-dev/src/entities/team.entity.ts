import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("Team")
export class TeamEntity {
  @PrimaryColumn({ name: "TeamId" })
  teamId: string;

  @Column({ name: "Name" })
  name: string;

  @Column("text", { name: "Description" })
  description: string;

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