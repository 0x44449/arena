import { Socket } from 'socket.io';
import ArenaCredential from './arena-credential';

export interface ArenaSocket extends Socket {
  credential?: ArenaCredential;
}