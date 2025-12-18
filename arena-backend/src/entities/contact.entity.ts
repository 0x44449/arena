import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
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
}
