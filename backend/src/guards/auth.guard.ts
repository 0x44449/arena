import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import admin from './firebase.plugin';
import { ArenaRequest } from '@/commons/arena-requset';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ArenaRequest>();

    const authHeader = request.headers.authorization || '';
    const [, idToken] = authHeader.split('Bearer ');

    if (!idToken) {
      return false; // No token provided
    }

    let decoded: DecodedIdToken | null = null;
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        })
      });
      decoded = await admin.auth().verifyIdToken(idToken);
    } catch {
      return false; // Invalid token
    }

    if (!decoded) {
      return false; // Token verification failed
    }

    request.credential = { uid: decoded.uid };
    return true;
  }
}