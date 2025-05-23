import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('RefreshToken')
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'TokenId' })
  tokenId: string;

  @Column({ name: 'UserId' })
  userId: string;

  @Column({ name: 'AccessToken' })
  accessToken: string;

  @Column({ name: 'RefreshToken' })
  refreshToken: string;

  @Column({ name: 'IsRevoked', default: false })
  isRevoked: boolean;

  @Column({ name: 'ExpiredAt', type: 'timestamptz' })
  expiredAt: Date;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamptz', nullable: true })
  updatedAt: Date;
}