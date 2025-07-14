import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import firebaseAdmin from '../libs/firebase.plugin';
import { ArenaRequest } from '@/commons/arena-requset';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/entities/user.entity';
import { Repository } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/decorators/allow-public.decorator';
import { UnauthorizedError } from '@/commons/exceptions/unauthorized-error';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<ArenaRequest>();

    const authHeader = request.headers.authorization || '';
    const [, idToken] = authHeader.split('Bearer ');

    if (!idToken) {
      throw new UnauthorizedError('No ID token provided');
    }

    let decoded: DecodedIdToken | null = null;
    try {
      decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
    } catch {
      throw new UnauthorizedError('Invalid ID token');
    }

    if (!decoded) {
      throw new UnauthorizedError('Token verification failed');
    }

    const userEntity = await this.userRepository.findOne({ where: { uid: decoded.uid } });
    if (!userEntity) {
      throw new UnauthorizedError('User not found');
    }

    request.credential = { user: userEntity };
    return true;
  }
}