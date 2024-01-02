import { Body, Controller, Delete, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { IJwtSchema } from "../@types/types";
import { AuthGuard } from "../infra/http/auth/auth.guard";
import { StockItemService } from "./stock_item.service";
import { InsertStockItemDto } from "./dto/stock-item.dto";

@Controller()
export class StockItemController {
  constructor(private readonly stockItemService: StockItemService) {}

  @Post("/stock-item/insert")
  @UseGuards(AuthGuard)
  async insertStockItemController(
    @Body() insertStockItemDto: InsertStockItemDto,
    @Req() req: Request,
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    const { stockId, stockItem } = insertStockItemDto;

    await this.stockItemService.insertStockItem(tokenParsed.sub, stockId, {
      ...stockItem,
      quantity: +stockItem.quantity,
    });

    return { message: "Stock Item successfully added." };
  }

  @Delete("/stock-item/remove/:stockItemId")
  @UseGuards(AuthGuard)
  async removeStockItemController() {}
}
