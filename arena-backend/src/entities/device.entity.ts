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

@Entity({ name: "devices" })
export class DeviceEntity {
  @PrimaryColumn({ type: "text" })
  deviceId: string;

  @Index("idx_devices_user_id")
  @Column({ type: "text" })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId", referencedColumnName: "userId" })
  user: UserEntity;

  @Column({ type: "text" })
  fcmToken: string;

  @Column({ type: "varchar", length: 20 })
  platform: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  deviceModel: string | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  osVersion: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamptz", nullable: true })
  deletedAt: Date | null;
}
