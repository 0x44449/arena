import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ALLOW_PUBLIC_KEY } from "../allow-public.decorator";
import { Reflector } from "@nestjs/core";
import { ArenaWebRequest } from "./arena-web-request";
import { ALLOW_ONLY_TOKEN_KEY } from "../allow-only-token.decorator";
import { AuthService } from "@/modules/auth/auth.service";
import { UnauthorizedError } from "@/exceptions/unauthorized-error";

@Injectable()
export class ArenaWebAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(ALLOW_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<ArenaWebRequest>();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError({
        message: 'No authentication token provided',
        errorCode: 'NO_AUTH_TOKEN',
      });
    }

    const [, token] = authHeader.split('Bearer ');
    if (!token) {
      throw new UnauthorizedError({
        message: 'No authentication token provided',
        errorCode: 'NO_AUTH_TOKEN',
      });
    }

    const credential = await this.authService.verifyToken(token);
    if (!credential.payload) {
      throw new UnauthorizedError({
        message: 'Invalid authentication token',
        errorCode: 'INVALID_AUTH_TOKEN',
      });
    }

    const allowOnlyToken = this.reflector.getAllAndOverride<boolean>(ALLOW_ONLY_TOKEN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (allowOnlyToken) {
      request.credential = {
        user: credential.user,
        payload: credential.payload,
      };
      return true;
    }

    if (!credential.user) {
      throw new UnauthorizedError({
        message: 'User not found for the given token',
        errorCode: 'USER_NOT_FOUND',
      });
    }

    request.credential = credential;
    return true;
  }
}