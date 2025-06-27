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

  @Column({ name: 'Text' })
  text: string;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamptz' })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamptz', nullable: true })
  updatedAt: Date;
}