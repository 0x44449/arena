import { ArenaSocket } from "@/commons/arena-socket";
import { createParamDecorator } from "@nestjs/common";

const ClientCred = createParamDecorator(
  (_, ctx) => {
    const client = ctx.switchToWs().getClient<ArenaSocket>()
    return client.credential;
  }
);

export default ClientCred;