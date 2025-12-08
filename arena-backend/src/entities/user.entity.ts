import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity("users")
export class UserEntity {
  @PrimaryColumn()
  uid: string;

  @Column({ unique: true })
  @Index()
  tag: string;

  @Column()
  name: string;

  @Column()
  avatarUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}