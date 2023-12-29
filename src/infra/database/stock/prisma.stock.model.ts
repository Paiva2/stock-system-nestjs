import { Injectable } from "@nestjs/common";
import { IStockCreate, IStock } from "../../../@types/types";
import { StockInterface } from "../../../stock/stock.interface";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaStockModel implements StockInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(
    userId: string,
    page: number,
  ): Promise<{ page: number; totalStocks: number; stocks: IStock[] }> {
    const perPage = 10;

    const stocks = await this.prismaService.stock.findMany({
      where: {
        stockOwner: userId,
      },
    });

    const stocksCount = stocks.length;

    const paginatedStocks = stocks.splice((page - 1) * perPage, page * perPage);

    return {
      page,
      totalStocks: stocksCount,
      stocks: paginatedStocks,
    };
  }

  async create(userId: string, stock: IStockCreate): Promise<IStock> {
    const createStock = await this.prismaService.stock.create({
      data: {
        stockName: stock.stockName,
        stockOwner: userId,
      },
    });

    return createStock;
  }
}
