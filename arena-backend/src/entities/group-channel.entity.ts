import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { ChannelEntity } from "./channel.entity";
import { FileEntity } from "./file.entity";

@Entity({ name: "group_channels" })
export class GroupChannelEntity {
  @PrimaryColumn({ type: "text" })
  channelId: string;

  @OneToOne(() => ChannelEntity)
  @JoinColumn({ name: "channelId", referencedColumnName: "channelId" })
  channel: ChannelEntity;

  @Column({ type: "text", nullable: true })
  iconFileId: string | null;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: "iconFileId", referencedColumnName: "fileId" })
  icon: FileEntity | null;
}
