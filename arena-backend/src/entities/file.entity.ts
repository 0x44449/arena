import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "files" })
export class FileEntity {
  @PrimaryGeneratedColumn("uuid")
  fileId: string;

  @Index("idx_files_owner_id")
  @Column({ type: "uuid" })
  ownerId: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "ownerId", referencedColumnName: "id" })
  owner: UserEntity;

  @Column({ type: "varchar", length: 512 })
  storedPath: string;

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
