import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { PrismaModule } from "src/infra/database/prisma.module";
import { AuthModule } from "src/infra/http/auth/auth.module";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
