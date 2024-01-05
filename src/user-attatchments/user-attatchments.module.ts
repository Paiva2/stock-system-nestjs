import { Module } from "@nestjs/common";
import { PrismaModule } from "../infra/database/prisma.module";
import { AuthModule } from "../infra/http/auth/auth.module";
import { UserAttatchmentsController } from "./user-attatchments.controller";
import { UserAttatchmentsService } from "./user-attatchments.service";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserAttatchmentsController],
  providers: [UserAttatchmentsService],
  exports: [UserAttatchmentsService],
})
export class UserAttatchmentsModule {}
