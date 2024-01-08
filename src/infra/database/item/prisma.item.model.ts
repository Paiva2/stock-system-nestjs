import { Injectable } from "@nestjs/common";
import { IITem } from "../../../@types/types";
import { ItemInterface } from "../../../item/item.interface";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaItemModel implements ItemInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, item: IITem): Promise<IITem> {
    const createItem = await this.prismaService.item.create({
      data: {
        categoryId: item.categoryId,
        description: item.description,
        itemName: item.itemName,
        userAttatchmentsId: userId,
      },
    });

    return createItem;
  }

  async findAllByUserId(userAttatchmentId: string): Promise<IITem[]> {
    const findItems = await this.prismaService.item.findMany({
      where: {
        userAttatchmentsId: userAttatchmentId,
      },
    });

    return findItems;
  }

  async findById(userAttatchmentId: string, itemId: string): Promise<IITem | null> {
    const findItem = await this.prismaService.item.findUnique({
      where: {
        id: itemId,
        AND: {
          userAttatchmentsId: userAttatchmentId,
        },
      },
    });

    if (!findItem) return null;

    return findItem;
  }

  async filterManyByCategory(
    userAttatchmentId: string,
    categoryId: string,
    page: number
  ): Promise<IITem[]> {
    const perPage = 10;

    const filterMany = await this.prismaService.item.findMany({
      where: {
        categoryId,
        AND: {
          userAttatchmentsId: userAttatchmentId,
        },
      },

      skip: (page - 1) * perPage,
      take: page * perPage,
    });

    return filterMany;
  }

  async delete(userAttatchmentId: string, itemId: string): Promise<IITem> {
    try {
      const removeItem = await this.prismaService.item.delete({
        where: {
          id: itemId,
          AND: {
            userAttatchmentsId: userAttatchmentId,
          },
        },
      });

      return removeItem;
    } catch (e) {
      if (e.code === "P2025") return null;
    }
  }
}
