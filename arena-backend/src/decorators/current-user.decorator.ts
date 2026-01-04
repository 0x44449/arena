import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CachedUser } from "src/modules/session/session.types";
import { WellKnownException } from "src/exceptions/well-known-exception";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CachedUser => {
    const request = ctx.switchToHttp().getRequest();
    const cachedUser = request.cachedUser;

    if (!cachedUser) {
      throw new WellKnownException({
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    return cachedUser;
  },
);
