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
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import {
  CreateStockDto,
  DeleteAccountStockDto,
  GetAllAccountStocksDto,
  GetStockByIdDto,
  UpdateStockDto,
  UpdateStockParamDto,
} from "./dto/stock.dto";
import { Request } from "express";
import { IJwtSchema } from "../@types/types";
import { AuthGuard } from "../infra/http/auth/auth.guard";
import { StockService } from "./stock.service";

@ApiTags("Stock")
@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @ApiBody({
    type: CreateStockDto,
    examples: {
      createStockDto: {
        value: {
          stockName: "My First Stock",
        },
      },
    },
  })
  @ApiBearerAuth()
  @Post("/stock")
  @UseGuards(AuthGuard)
  async createStockController(
    @Body(ValidationPipe) createStockDto: CreateStockDto,
    @Req() req: Request
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    await this.stockService.createStock(tokenParsed.sub, createStockDto);

    return { message: "Stock successfully created." };
  }

  @ApiQuery({
    name: "active",
    type: Boolean,
    required: false,
    example: "true",
  })
  @ApiBearerAuth()
  @Get("/stocks") // ?active=true or ?active=false
  @UseGuards(AuthGuard)
  async getAllAccountStocksController(
    @Req() req: Request,
    @Query(ValidationPipe) query: GetAllAccountStocksDto
  ) {
    const tokenParsed: IJwtSchema = req["user"];
    const { active, page } = query;

    if (active) {
      const filterActives = active === "true";

      const getStocksFiltered = await this.stockService.filterStocks(
        tokenParsed.sub,
        filterActives,
        +page
      );

      return getStocksFiltered;
    }

    const allStocks = await this.stockService.getAllAccountStocks(
      tokenParsed.sub,
      +page
    );

    return allStocks;
  }

  @ApiParam({
    name: "stockId",
    allowEmptyValue: false,
    example: "stockId",
  })
  @Get("/stock/:stockId")
  @UseGuards(AuthGuard)
  async getStockByIdController(
    @Req() req: Request,
    @Param(ValidationPipe) param: GetStockByIdDto
  ) {
    const tokenParsed: IJwtSchema = req["user"];
    const { stockId } = param;

    const filteredStock = await this.stockService.getStockById(
      tokenParsed.sub,
      stockId
    );

    return filteredStock;
  }

  @ApiParam({
    name: "stockId",
    allowEmptyValue: false,
    example: "stockId",
  })
  @Delete("/stock/delete/:stockId")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async deleteAccountStockController(
    @Req() req: Request,
    @Param(ValidationPipe) param: DeleteAccountStockDto
  ) {
    const tokenParsed: IJwtSchema = req["user"];
    const { stockId } = param;

    await this.stockService.deleteAccountStock(tokenParsed.sub, stockId);

    return { message: "Stock deleted successfully." };
  }

  @ApiBody({
    type: UpdateStockDto,
    examples: {
      updateStockDto: {
        value: {
          stockName: "New Stock Name",
          active: "false",
        },
      },
    },
  })
  @ApiParam({
    name: "stockId",
    allowEmptyValue: false,
    example: "stockId",
  })
  @Patch("/stock/:stockId")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async updateStockController(
    @Req() req: Request,
    @Param(ValidationPipe) param: UpdateStockParamDto,
    @Body() updateStockDto: UpdateStockDto
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
