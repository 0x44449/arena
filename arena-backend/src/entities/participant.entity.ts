import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { ChannelEntity } from "./channel.entity";
import { UserEntity } from "./user.entity";

@Entity({ name: "participants" })
export class ParticipantEntity {
  @PrimaryColumn({ type: "text" })
  channelId: string;

  @PrimaryColumn({ type: "text" })
  userId: string;

  @ManyToOne(() => ChannelEntity)
  @JoinColumn({ name: "channelId", referencedColumnName: "channelId" })
  channel: ChannelEntity;

  @Index("idx_participants_user_id")
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "userId", referencedColumnName: "userId" })
  user: UserEntity;

  @Column({ type: "timestamptz", nullable: true })
  lastReadAt: Date | null;

  @CreateDateColumn({ type: "timestamptz" })
  joinedAt: Date;
}
