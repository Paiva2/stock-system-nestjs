import { Injectable } from "@nestjs/common";
import { IStockCreate, IStock, IStockUpdate } from "../../../@types/types";
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

  async getByStockName(
    stockName: string,
    userId: string,
  ): Promise<IStock | null> {
    const findByUsername = await this.prismaService.stock.findFirst({
      where: {
        stockName,
        stockOwner: userId,
      },
    });

    if (!findByUsername) return null;

    return findByUsername;
  }

  async delete(stockId: string, userId: string): Promise<IStock | null> {
    try {
      const deleteStock = await this.prismaService.stock.delete({
        where: {
          id: stockId,
          AND: {
            stockOwner: userId,
          },
        },
      });

      return deleteStock;
    } catch (e) {
      if (e.code === "P2025") return null;
    }
  }

  async getById(stockId: string): Promise<IStock | null> {
    const getStock = await this.prismaService.stock.findUnique({
      where: {
        id: stockId,
      },
    });

    if (!getStock) return null;

    return getStock;
  }

  async update(userId: string, stock: IStockUpdate): Promise<IStock> {
    try {
      const updateStock = await this.prismaService.stock.update({
        where: {
          id: stock.id,
          AND: {
            stockOwner: userId,
          },
        },
        data: stock,
      });

      return updateStock;
    } catch (e) {
      if (e.code === "P2025") return null;
    }
  }
}
