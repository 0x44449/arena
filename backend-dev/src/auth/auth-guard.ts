import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ALLOW_PUBLIC_KEY } from "./allow-public.decorator";
import { Reflector } from "@nestjs/core";
import { verifySupabaseJwt } from "./supabase.jwt";
import { ArenaWebRequest } from "./arena-web-request";
import { ALLOW_ONLY_TOKEN_KEY } from "./allow-only-token.decorator";
import { UserService } from "@/modules/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
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
      throw new Error('No authentication token provided');
    }

    const [, token] = authHeader.split('Bearer ');
    if (!token) {
      throw new Error('No authentication token provided');
    }

    const payload = await verifySupabaseJwt(token);
    const allowOnlyToken = this.reflector.getAllAndOverride<boolean>(ALLOW_ONLY_TOKEN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (allowOnlyToken) {
      request.credential = {
        user: null,
        payload,
      };
      return true;
    }

    const user = await this.userService.findUserByEmail(payload.email as string);
    if (!user) {
      throw new Error('User not registered');
    }

    request.credential = {
      user,
      payload,
    };
    return true;
  }
}