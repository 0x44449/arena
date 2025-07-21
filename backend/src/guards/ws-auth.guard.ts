import { ArenaSocket } from "@/commons/arena-socket";
import { UnauthorizedError } from "@/commons/exceptions/unauthorized-error";
import { WellKnownError } from "@/commons/exceptions/well-known-error";
import firebaseAdmin from "@/commons/firebase.plugin";
import { UserEntity } from "@/entities/user.entity";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Repository } from "typeorm";

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<ArenaSocket>();

    const idToken: string | undefined = typeof client.handshake.auth?.token === 'string'
      ? client.handshake.auth.token
      : typeof client.handshake.headers.authorization === 'string'
        ? client.handshake.headers.authorization.split(' ')[1]
        : undefined;

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
      // throw new UnauthorizedError('User not found');
      throw new WellKnownError({
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND',
      });
    }

    client.credential = { user: userEntity };
    return true;
  }
}