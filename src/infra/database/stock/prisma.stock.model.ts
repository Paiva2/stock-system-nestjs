import { Injectable } from "@nestjs/common";
import { IStockCreate, IStock, IStockUpdate } from "../../../@types/types";
import { StockInterface } from "../../../stock/stock.interface";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaStockModel implements StockInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(
    userId: string,
    page: number
  ): Promise<{ page: number; totalStocks: number; stocks: IStock[] }> {
    const perPage = 10;

    let stocks: IStock[] = await this.prismaService.stock.findMany({
      where: {
        stockOwner: userId,
      },
      include: {
        items: true,
      },

      skip: (page - 1) * perPage,
      take: page * perPage,
    });

    const formatStocksWithItemCount = stocks.map((stock) => {
      stock.totalItems = stock.items.length;

      delete stock.items;

      return stock;
    });

    return {
      page,
      totalStocks: stocks.length,
      stocks: formatStocksWithItemCount,
    };
  }

  async create(userId: string, stock: IStockCreate): Promise<IStock> {
    const createStock: IStock = await this.prismaService.stock.create({
      data: {
        stockName: stock.stockName,
        stockOwner: userId,
      },
    });

    createStock.totalItems = 0;

    return createStock;
  }

  async getByStockName(stockName: string, userId: string): Promise<IStock | null> {
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
      include: {
        items: true,
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

  async getByStatus(
    userId: string,
    page: number,
    active: boolean
  ): Promise<{ page: number; totalStocks: number; stocks: IStock[] }> {
    const perPage = 10;

    const filterStocks: IStock[] = await this.prismaService.stock.findMany({
      where: {
        active,
        AND: {
          stockOwner: userId,
        },
      },
      include: {
        items: true,
      },
      skip: (page - 1) * perPage,
      take: page * perPage,
    });

    const formatStocksWithItemCount = filterStocks.map((stock) => {
      stock.totalItems = stock.items.length;

      delete stock.items;

      return stock;
    });

    return {
      page,
      totalStocks: formatStocksWithItemCount.length,
      stocks: formatStocksWithItemCount,
    };
  }
}
