import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

  @Column('text', { name: 'Content' })
  content: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt', nullable: true })
  updatedAt: Date;
}