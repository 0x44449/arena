import { ArenaRequest } from "@/commons/arena-request";
import { createParamDecorator } from "@nestjs/common"

const ReqCred = createParamDecorator(
  (_, ctx) => {
    const request = ctx.switchToHttp().getRequest<ArenaRequest>()
    return request.credential
  }
);

export default ReqCred;