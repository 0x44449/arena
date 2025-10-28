import { Module } from "@nestjs/common";
import { LiveController } from "./live.controller";
import { LiveService } from "./live.service";
import { AuthModule } from "../auth/auth.module";
import { RealtimeModule } from "../realtime/realtime.module";

@Module({
  imports: [AuthModule, RealtimeModule],
  controllers: [LiveController],
  providers: [LiveService],
})
export class LiveModule {}