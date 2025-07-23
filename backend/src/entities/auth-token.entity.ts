import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('AuthToken')
export class AuthTokenEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'TokenId' })
  tokenId: string;

  @Column({ name: 'UserId' })
  userId: string;

  @Column({ name: 'AccessToken' })
  accessToken: string;

  @Column({ name: 'RefreshToken' })
  refreshToken: string;

  @Column({ name: 'IssuedAt', type: 'timestamptz' })
  issuedAt: Date;

  @Column({ name: 'RevokedAt', type: 'timestamptz', nullable: true })
  revokedAt: Date | null;

  @Column({ name: 'ReplacedBy', type: 'uuid', nullable: true })
  replacedBy: string | null;

  @Column({ name: 'ExpiredAt', type: 'timestamptz' })
  expiredAt: Date;

  @Column({ name: 'AbsoluteExpiresAt', type: 'timestamptz' })
  absoluteExpiresAt: Date;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt', type: 'timestamptz', nullable: true })
  updatedAt: Date | null;
}