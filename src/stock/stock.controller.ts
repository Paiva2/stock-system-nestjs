import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "../infra/http/auth/auth.guard";
import { StockService } from "./stock.service";
import { Request, Response } from "express";
import { CreateStockDto } from "./dto/stock.dto";
import { IJwtSchema } from "../@types/types";

@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post("/stock")
  @UseGuards(AuthGuard)
  async createStock(
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

  @Get("/stock")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getAllAccountStocks(@Req() req: Request, @Res() res: Response) {
    const tokenParsed: IJwtSchema = req["user"];

    return res.status(HttpStatus.OK).send();
  }
}
