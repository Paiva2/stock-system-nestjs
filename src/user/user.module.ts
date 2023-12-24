import { Module } from "@nestjs/common";
import { PrismaModule } from "../infra/database/prisma.module";
import { PrismaUserModel } from "../infra/database/user/prisma.user.model";
import { UserController } from "./user.controller";
import { UserInterface } from "./user.interface";
import { UserService } from "./user.service";
import { AuthModule } from "../infra/http/auth/auth.module";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserController],
  providers: [
    { provide: UserInterface, useClass: PrismaUserModel },
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
