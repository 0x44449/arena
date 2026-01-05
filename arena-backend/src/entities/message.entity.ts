import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { ChannelEntity } from "./channel.entity";
import { UserEntity } from "./user.entity";

@Entity({ name: "messages" })
@Index("idx_messages_channel_seq", ["channelId", "seq"])
export class MessageEntity {
  @PrimaryColumn({ type: "text" })
  messageId: string;

  @Column({ type: "text" })
  channelId: string;

  @Column({ type: "text" })
  senderId: string;

  @Column({ type: "bigint" })
  seq: number;

  @Column({ type: "text" })
  content: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamptz", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => ChannelEntity)
  @JoinColumn({ name: "channelId", referencedColumnName: "channelId" })
  channel: ChannelEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "senderId", referencedColumnName: "userId" })
  sender: UserEntity;
}
