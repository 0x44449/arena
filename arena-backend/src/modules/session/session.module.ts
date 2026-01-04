import { Global, Module, forwardRef } from "@nestjs/common";
import { SessionService } from "./session.service";
import { SessionGuard } from "./session.guard";
import { UserModule } from "../user/user.module";

@Global()
@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [SessionService, SessionGuard],
  exports: [SessionService, SessionGuard],
})
export class SessionModule {}
