import { WellKnownError } from "@/commons/exceptions/well-known-error";
import firebaseAdmin from "@/commons/firebase.plugin";
import { UserEntity } from "@/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createSessionCookie(token: string): Promise<string> {
    let decoded: DecodedIdToken | null = null;
    try {
      decoded = await firebaseAdmin.auth().verifyIdToken(token);
    } catch {
      throw new WellKnownError({
        message: 'Invalid ID token',
        errorCode: 'INVALID_ID_TOKEN',
      });
    }

    const user = await this.userRepository.findOne({ where: { uid: decoded.uid } });
    if (!user) {
      throw new WellKnownError({
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND',
      });
    }

    const sessionCookie = await firebaseAdmin.auth().createSessionCookie(token, { expiresIn: 5 * 60 * 60 * 24 * 1000 }); // 5 days
    return sessionCookie;
  }
}