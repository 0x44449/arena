import { Column, CreateDateColumn, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";
import { UserEntity } from "./user.entity";
import { FileEntity } from "./file.entity";

@Entity('ChatMessage')
export class ChatMessageEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'MessageId' })
  messageId: string;

  @Column('bigint', {
    name: 'Seq',
    transformer: { to: v => v.toString(), from: v => parseInt(v, 10) }
  })
  @Index()
  seq: number;

  @Column({ name: 'ChannelId' })
  @Index()
  channelId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'SenderId' })
  sender: UserEntity;

  @Column({ name: 'SenderId' })
  senderId: string;

  @Column('text', { name: 'Message' })
  message: string;

  @ManyToMany(() => FileEntity)
  @JoinTable({
    name: 'ChatAttachment', // Relation 전용 테이블, 자동 생성됨
    joinColumn: { name: 'MessageId' },
    inverseJoinColumn: { name: 'FileId' },
  })
  attachments: FileEntity[];

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamptz', nullable: true })
  updatedAt: Date;
}