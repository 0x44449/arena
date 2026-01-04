import { Global, Module } from "@nestjs/common";
import { SignalService } from "./signal.service";

@Global()
@Module({
  providers: [SignalService],
  exports: [SignalService],
})
export class SignalModule {}
