import { Module } from "@nestjs/common";
import { StockItemController } from "./stock_item.controller";
import { StockItemService } from "./stock_item.service";

@Module({
  controllers: [StockItemController],
  providers: [StockItemService],
})
export class StockItemModule {}
