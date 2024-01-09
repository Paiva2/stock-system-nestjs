import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import {
  EditStockItemDto,
  FilterStockItemByIdDto,
  InsertStockItemDto,
  RemoveStockItemBodyDto,
  RemoveStockItemParamDto,
} from "./dto/stock-item.dto";
import { Request } from "express";
import { IJwtSchema } from "../@types/types";
import { AuthGuard } from "../infra/http/auth/auth.guard";
import { StockItemService } from "./stock_item.service";

@Controller()
export class StockItemController {
  constructor(private readonly stockItemService: StockItemService) {}

  @Post("/stock-item/insert")
  @UseGuards(AuthGuard)
  async insertStockItemController(
    @Body() insertStockItemDto: InsertStockItemDto,
    @Req() req: Request
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
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async removeStockItemController(
    @Body(ValidationPipe) removeStockItemBodyDto: RemoveStockItemBodyDto,
    @Param(ValidationPipe) removeStockItemParamDto: RemoveStockItemParamDto,
    @Req() req: Request
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    await this.stockItemService.removeStockItem(
      tokenParsed.sub,
      removeStockItemParamDto.stockItemId,
      removeStockItemBodyDto.stockId
    );

    return { message: "Stock Item successfully removed." };
  }

  @Patch("/stock-item")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async editStockItemController(
    @Body(ValidationPipe) editStockItemDto: EditStockItemDto,
    @Req() req: Request
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    const { stockItem, stockId } = editStockItemDto;

    await this.stockItemService.editStockItem(tokenParsed.sub, stockId, stockItem);

    return { message: "Stock Item successfully updated." };
  }

  @Get("/stock-item/:stockId/:stockItemId")
  @UseGuards(AuthGuard)
  async filterStockItemByIdController(
    @Param(ValidationPipe) filterStockItemByIdDto: FilterStockItemByIdDto,
    @Req() req: Request
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    const { stockItemId, stockId } = filterStockItemByIdDto;

    const findStockItem = await this.stockItemService.filterStockItemById(
      tokenParsed.sub,
      stockId,
      stockItemId
    );

    return findStockItem;
  }
}
