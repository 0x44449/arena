import { UserEntity } from '@/entity/user.entity';
import { Request } from 'express';

export interface ArenaRequest extends Request {
  user?: UserEntity;
}