import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { ParticipantEntity } from "./participant.entity";

export type GroupParticipantRole = "owner" | "member";

@Entity({ name: "group_participants" })
export class GroupParticipantEntity {
  @PrimaryColumn({ type: "text" })
  channelId: string;

  @PrimaryColumn({ type: "text" })
  userId: string;

  @OneToOne(() => ParticipantEntity)
  @JoinColumn([
    { name: "channelId", referencedColumnName: "channelId" },
    { name: "userId", referencedColumnName: "userId" },
  ])
  participant: ParticipantEntity;

  @Column({ type: "varchar", length: 20 })
  role: GroupParticipantRole;

  @Column({ type: "varchar", length: 32, nullable: true })
  nickname: string | null;
}
