import { UserEntity } from '@/entity/user.entity';
import { Socket } from 'socket.io';

export interface ArenaSocket extends Socket {
  user?: UserEntity;
}