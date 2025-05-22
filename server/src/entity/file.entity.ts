import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

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

  @Column({ name: 'UploaderId' })
  uploaderId: string;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamptz' })
  createdAt: Date;
}