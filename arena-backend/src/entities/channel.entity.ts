import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export type ChannelType = "direct" | "group" | "team";

@Entity({ name: "channels" })
export class ChannelEntity {
  @PrimaryColumn({ type: "text" })
  channelId: string;

  @Column({ type: "varchar", length: 20 })
  type: ChannelType;

  @Column({ type: "varchar", length: 100, nullable: true })
  name: string | null;

  @Column({ type: "text", nullable: true })
  teamId: string | null;

  @Column({ type: "timestamptz", nullable: true })
  lastMessageAt: Date | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamptz", nullable: true })
  deletedAt: Date | null;
}
