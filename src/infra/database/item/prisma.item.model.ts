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
}
