import { Module } from "@nestjs/common";
import { StockController } from "./stock.controller";
import { StockService } from "./stock.service";
import { PrismaModule } from "../infra/database/prisma.module";
import { AuthModule } from "../infra/http/auth/auth.module";
import { UserInterface } from "../user/user.interface";
import { PrismaUserModel } from "../infra/database/user/prisma.user.model";
import { StockInterface } from "./stock.interface";
import { PrismaStockModel } from "../infra/database/stock/prisma.stock.model";
import { StockItemInterface } from "src/stock_item/stock_item.interface";
import { PrismaStockItemModel } from "src/infra/database/stock_item/prisma.stock-item.model";
import { CategoryInterface } from "src/category/category.interface";
import { PrismaCategoryModel } from "src/infra/database/category/prisma.category.model";

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
    {
      provide: StockItemInterface,
      useClass: PrismaStockItemModel,
    },
    {
      provide: CategoryInterface,
      useClass: PrismaCategoryModel,
    },
    StockService,
  ],
  exports: [StockService],
})
export class StockModule {}
