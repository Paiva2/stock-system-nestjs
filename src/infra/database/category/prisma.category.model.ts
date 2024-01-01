import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CategoryInterface } from "../../../category/category.interface";
import { ICategory } from "../../../@types/types";

@Injectable()
export class PrismaCategoryModel implements CategoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async create(categoryName: string): Promise<ICategory> {
    const createCategory = await this.prismaService.category.create({
      data: {
        name: categoryName,
      },
    });

    return createCategory;
  }

  async findByName(categoryName: string): Promise<ICategory> {
    const findCategory = await this.prismaService.category.findFirst({
      where: {
        name: categoryName,
      },
    });

    if (!findCategory) return null;

    return findCategory;
  }
}
