import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("User")
export class UserEntity {
  @PrimaryColumn({ name: "UserId" })
  userId: string;

  @Column({ name: "Email", unique: true })
  email: string;

  @Column({ name: "Uid", unique: true })
  uid: string;

  @Column({ name: "DisplayName" })
  displayName: string;

  @Column({ name: "AvatarId" })
  avatarId: string;

  @Column({ name: "Message" })
  message: string;

  @CreateDateColumn({ name: "CreatedAt", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "UpdatedAt", type: "timestamptz", nullable: true })
  updatedAt: Date;
}