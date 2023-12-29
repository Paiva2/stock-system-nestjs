import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "../infra/http/auth/auth.guard";
import { IJwtSchema } from "../@types/types";
import { StockService } from "./stock.service";
import { Request, Response } from "express";
import {
  CreateStockDto,
  DeleteAccountStockDto,
  GetAllAccountStocksDto,
} from "./dto/stock.dto";

@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post("/stock")
  @UseGuards(AuthGuard)
  async createStockController(
    @Body(ValidationPipe) createStockDto: CreateStockDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    await this.stockService.createStock(tokenParsed.sub, createStockDto);

    return res
      .status(HttpStatus.CREATED)
      .send({ message: "Stock successfully created." });
  }

  @Get("/stocks")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getAllAccountStocksController(
    @Req() req: Request,
    @Res() res: Response,
    @Query(ValidationPipe) query: GetAllAccountStocksDto,
  ) {
    const tokenParsed: IJwtSchema = req["user"];
    const { page } = query;

    const allStocks = await this.stockService.getAllAccountStocks(
      tokenParsed.sub,
      +page,
    );

    return res.status(HttpStatus.OK).send(allStocks);
  }

  @Delete("/stock/delete/:stockId")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async deleteAccountStockController(
    @Req() req: Request,
    @Res() res: Response,
    @Param(ValidationPipe) param: DeleteAccountStockDto,
  ) {
    const tokenParsed: IJwtSchema = req["user"];
    const { stockId } = param;

    await this.stockService.deleteAccountStock(tokenParsed.sub, stockId);

    return res
      .status(HttpStatus.OK)
      .send({ message: "Stock deleted successfully." });
  }
}
