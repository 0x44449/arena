import { createParamDecorator } from "@nestjs/common";
import { ArenaWebRequest } from "./arena-web-request";

const ReqCredential = createParamDecorator(
  (_, ctx) => {
    const request = ctx.switchToHttp().getRequest<ArenaWebRequest>();
    return request.credential;
  }
);

export default ReqCredential;