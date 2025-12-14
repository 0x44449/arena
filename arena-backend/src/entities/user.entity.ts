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
import { FileEntity } from "./file.entity";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryColumn({ type: "text" })
  userId: string;

  @Column({ type: "text", unique: true })
  uid: string;

  @Column({ type: "varchar", length: 8, unique: true })
  utag: string;

  @Index("idx_users_nick")
  @Column({ type: "varchar", length: 32 })
  nick: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email: string | null;

  @Column({ type: "varchar", length: 140, nullable: true })
  statusMessage: string | null;

  @Column({ type: "text", nullable: true })
  avatarFileId: string | null;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: "avatarFileId", referencedColumnName: "fileId" })
  avatar: FileEntity | null;

  @DeleteDateColumn({ type: "timestamptz", nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
