import { Module } from "@nestjs/common";
import { StockController } from "./stock.controller";
import { StockService } from "./stock.service";
import { PrismaModule } from "../infra/database/prisma.module";
import { AuthModule } from "../infra/http/auth/auth.module";
import { UserInterface } from "../user/user.interface";
import { PrismaUserModel } from "../infra/database/user/prisma.user.model";
import { StockInterface } from "./stock.interface";
import { PrismaStockModel } from "../infra/database/stock/prisma.stock.model";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [StockController],
  providers: [
    {
      provide: UserInterface,
      useClass: PrismaUserModel,
    },
    {
      provide: StockInterface,
      useClass: PrismaStockModel,
    },
    StockService,
  ],
  exports: [StockService],
})
export class StockModule {}
