import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { SessionService } from "./session.service";

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtPayload = request.user; // ArenaJwtAuthGuard가 먼저 실행되어 설정됨

    if (!jwtPayload?.uid) {
      return true; // JWT 없으면 패스 (ArenaJwtAuthGuard가 처리)
    }

    const cachedUser = await this.sessionService.getOrFetch(jwtPayload.uid);
    request.cachedUser = cachedUser;

    return true;
  }
}
