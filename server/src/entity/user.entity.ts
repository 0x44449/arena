import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('User')
export class UserEntity {
  @PrimaryColumn({ name: 'UserId' })
  userId: string;

  @Column({ name: 'Email', unique: true })
  email: string;

  @Column({ name: 'LoginId', unique: true })
  loginId: string;

  @Column({ name: 'DisplayName' })
  displayName: string;

  @Column({ name: 'Password' })
  password: string;

  // @Column({
  //   name: 'AvatarType',
  //   type: 'enum', 
  //   enum: AvatarType,
  //   default: AvatarType.DEFAULT,
  // })
  // avatarType: AvatarType;
  @Column({ name: 'AvatarType', nullable: true })
  avatarType: string;

  @Column({ name: 'AvatarKey', nullable: true })
  avatarKey: string;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamptz', nullable: true })
  updatedAt: Date;
}