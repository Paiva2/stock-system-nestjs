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
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "../infra/http/auth/auth.guard";
import { IJwtSchema } from "../@types/types";
import { StockService } from "./stock.service";
import { Request } from "express";
import {
  CreateStockDto,
  DeleteAccountStockDto,
  GetAllAccountStocksDto,
  GetStockByIdDto,
  UpdateStockDto,
  UpdateStockParamDto,
} from "./dto/stock.dto";

@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post("/stock")
  @UseGuards(AuthGuard)
  async createStockController(
    @Body(ValidationPipe) createStockDto: CreateStockDto,
    @Req() req: Request,
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    await this.stockService.createStock(tokenParsed.sub, createStockDto);

    return { message: "Stock successfully created." };
  }

  @Get("/stocks")
  @UseGuards(AuthGuard)
  async getAllAccountStocksController(
    @Req() req: Request,
    @Query(ValidationPipe) query: GetAllAccountStocksDto,
  ) {
    const tokenParsed: IJwtSchema = req["user"];
    const { page } = query;

    const allStocks = await this.stockService.getAllAccountStocks(
      tokenParsed.sub,
      +page,
    );

    return allStocks;
  }

  @Get("/stock/:stockId")
  @UseGuards(AuthGuard)
  async getStockByIdController(
    @Req() req: Request,
    @Param(ValidationPipe) param: GetStockByIdDto,
  ) {
    const tokenParsed: IJwtSchema = req["user"];
    const { stockId } = param;

    const filteredStock = await this.stockService.getStockById(
      tokenParsed.sub,
      stockId,
    );

    return filteredStock;
  }

  @Delete("/stock/delete/:stockId")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async deleteAccountStockController(
    @Req() req: Request,
    @Param(ValidationPipe) param: DeleteAccountStockDto,
  ) {
    const tokenParsed: IJwtSchema = req["user"];
    const { stockId } = param;

    await this.stockService.deleteAccountStock(tokenParsed.sub, stockId);

    return { message: "Stock deleted successfully." };
  }

  @Patch("/stock/:stockId")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async updateStockController(
    @Req() req: Request,
    @Param(ValidationPipe) param: UpdateStockParamDto,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    const tokenParsed: IJwtSchema = req["user"];
    const { stockId } = param;

    await this.stockService.updateStock(tokenParsed.sub, {
      id: stockId,
      ...updateStockDto,
    });

    return { message: "Stock updated successfully." };
  }
}
