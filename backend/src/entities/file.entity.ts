import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('File')
export class FileEntity {
  @PrimaryColumn({ name: 'FileId' })
  fileId: string;

  @Column({ name: 'OriginalName' })
  originalName: string;

  @Column({ name: 'StoredName' })
  storedName: string;

  @Column({ name: 'MimeType' })
  mimeType: string;

  @Column({ name: 'Size' })
  size: number;

  @Column({ name: 'Path' })
  path: string;

  @OneToOne(() => UserEntity, { eager: true })
  uploader: UserEntity;

  @Column({ name: 'Category' })
  category: string;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamptz' })
  createdAt: Date;
}