import { Column, Entity, Index, PrimaryColumn } from "typeorm";
import { ChatAttachmentMetadataType } from "../types/chat-attachment-metadata.type";

@Entity('ChatAttachment')
export class ChatAttachmentEntity {
  @PrimaryColumn({ name: 'FileId'})
  fileId: string;

  @Column({ name: 'FeatureId' })
  @Index()
  featureId: string;

  @Column({ name: 'MessageId', nullable: true, default: null })
  @Index()
  messageId: string;

  @Column({ name: 'Type' })
  type: 'image' | 'video' | 'file';

  @Column('json', { name: 'Metadata' })
  metadata: ChatAttachmentMetadataType;
}