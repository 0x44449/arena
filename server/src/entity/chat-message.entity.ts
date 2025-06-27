import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ChatMessageContent } from "./chat-message-content.type";

@Entity('ChatMessage')
export class ChatMessageEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'MessageId' })
  messageId: string;

  @Column({ name: 'FeatureId' })
  @Index()
  featureId: string;

  @Column({ name: 'SenderId' })
  @Index()
  senderId: string;

  @Column('json', { name: 'Content' })
  content: ChatMessageContent;

  @Column({
    name: 'ContentType',
    type: 'enum',
    enum: ['text', 'image']
  })
  contentType: 'text' | 'image';

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamptz' })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamptz', nullable: true })
  updatedAt: Date;
}