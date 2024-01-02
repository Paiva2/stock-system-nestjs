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

  async getAll(page: number): Promise<{
    page: number;
    totalCategories: number;
    categories: ICategory[];
  }> {
    const perPage = 10;

    const categories = await this.prismaService.category.findMany({});

    const categoriesCount = categories.length;

    const paginatedCategories = categories.splice(
      (page - 1) * perPage,
      page * perPage,
    );

    return {
      page,
      totalCategories: categoriesCount,
      categories: paginatedCategories,
    };
  }

  async delete(categoryId: string): Promise<ICategory> {
    try {
      const deleteCategory = await this.prismaService.category.delete({
        where: {
          id: categoryId,
        },
      });

      return deleteCategory;
    } catch (e) {
      if (e.code === "P2025") return null;
    }
  }

  async update(category: { id: string; name: string }): Promise<ICategory> {
    try {
      const updateCategory = await this.prismaService.category.update({
        where: {
          id: category.id,
        },
        data: category,
      });

      return updateCategory;
    } catch (e) {
      if (e.code === "P2025") return null;
    }
  }
}
