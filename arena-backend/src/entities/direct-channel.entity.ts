import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ChannelEntity } from './channel.entity';

@Entity({ name: 'direct_channels' })
export class DirectChannelEntity {
  @PrimaryColumn({ type: 'text' })
  channelId: string;

  @OneToOne(() => ChannelEntity)
  @JoinColumn({ name: 'channelId', referencedColumnName: 'channelId' })
  channel: ChannelEntity;
}
