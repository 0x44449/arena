import { Request } from 'express';
import ArenaCredential from './arena-credential';

export interface ArenaRequest extends Request {
  credential?: ArenaCredential;
}