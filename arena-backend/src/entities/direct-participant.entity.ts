import {
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { ParticipantEntity } from "./participant.entity";

@Entity({ name: "direct_participants" })
export class DirectParticipantEntity {
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
}
