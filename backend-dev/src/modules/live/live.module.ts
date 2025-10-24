import { Module } from "@nestjs/common";
import { LiveController } from "./live.controller";
import { LiveService } from "./live.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [LiveController],
  providers: [LiveService],
})
export class LiveModule {}