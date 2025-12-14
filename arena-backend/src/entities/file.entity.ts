import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "files" })
export class FileEntity {
  @PrimaryColumn({ type: "text" })
  fileId: string;

  @Index("idx_files_owner_id")
  @Column({ type: "text" })
  ownerId: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "ownerId", referencedColumnName: "userId" })
  owner: UserEntity;

  @Column({ type: "varchar", length: 512 })
  storageKey: string;

  @Column({ type: "varchar", length: 20 })
  bucket: string;

  @Column({ type: "varchar", length: 127 })
  mimeType: string;

  @Column({ type: "bigint" })
  size: string;

  @Column({ type: "varchar", length: 255 })
  originalName: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamptz", nullable: true })
  deletedAt: Date | null;
}
