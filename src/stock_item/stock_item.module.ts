import { Module } from "@nestjs/common";
import { StockItemController } from "./stock_item.controller";
import { StockItemService } from "./stock_item.service";
import { PrismaModule } from "../infra/database/prisma.module";
import { AuthModule } from "../infra/http/auth/auth.module";
import { UserInterface } from "../user/user.interface";
import { PrismaUserModel } from "../infra/database/user/prisma.user.model";
import { StockInterface } from "../stock/stock.interface";
import { PrismaStockModel } from "../infra/database/stock/prisma.stock.model";
import { CategoryInterface } from "../category/category.interface";
import { PrismaCategoryModel } from "../infra/database/category/prisma.category.model";
import { StockItemInterface } from "./stock_item.interface";
import { PrismaStockItemModel } from "../infra/database/stock_item/prisma.stock-item.model";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [StockItemController],
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
      provide: CategoryInterface,
      useClass: PrismaCategoryModel,
    },
    {
      provide: StockItemInterface,
      useClass: PrismaStockItemModel,
    },
    StockItemService,
  ],
  exports: [StockItemService],
})
export class StockItemModule {}
