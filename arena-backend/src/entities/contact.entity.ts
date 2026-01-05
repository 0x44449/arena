import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "contacts" })
export class ContactEntity {
  @PrimaryColumn({ type: "text" })
  ownerId: string;

  @PrimaryColumn({ type: "text" })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "ownerId", referencedColumnName: "userId" })
  owner: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "userId", referencedColumnName: "userId" })
  user: UserEntity;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamptz", nullable: true })
  deletedAt: Date | null;
}
