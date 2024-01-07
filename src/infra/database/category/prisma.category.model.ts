import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CategoryInterface } from "../../../category/category.interface";
import { ICategory } from "../../../@types/types";

@Injectable()
export class PrismaCategoryModel implements CategoryInterface {
  constructor(private readonly prismaService: PrismaService) {}
  async create(userAttatchmentId: string, categoryName: string): Promise<ICategory> {
    const createCategory = await this.prismaService.category.create({
      data: {
        name: categoryName,
        userAttatchmentsId: userAttatchmentId,
      },
    });

    return createCategory;
  }

  async findByName(
    userAttatchmentId: string,
    categoryName: string
  ): Promise<ICategory> {
    const findCategory = await this.prismaService.category.findFirst({
      where: {
        name: categoryName,
        AND: {
          userAttatchmentsId: userAttatchmentId,
        },
      },
    });

    if (!findCategory) return null;

    return findCategory;
  }

  async getAll(
    page: number,
    userAttatchmentId: string
  ): Promise<{
    page: number;
    totalCategories: number;
    categories: ICategory[];
  }> {
    const perPage = 10;

    const categories = await this.prismaService.category.findMany({
      where: {
        userAttatchmentsId: userAttatchmentId,
      },
    });

    const categoriesCount = categories.length;

    const paginatedCategories = categories.splice(
      (page - 1) * perPage,
      page * perPage
    );

    return {
      page,
      totalCategories: categoriesCount,
      categories: paginatedCategories,
    };
  }

  async delete(userAttatchmentId: string, categoryId: string): Promise<ICategory> {
    try {
      const deleteCategory = await this.prismaService.category.delete({
        where: {
          id: categoryId,
          userAttatchmentsId: userAttatchmentId,
        },
      });

      return deleteCategory;
    } catch (e) {
      if (e.code === "P2025") return null;
    }
  }

  async update(
    userAttatchmentId: string,
    category: { id: string; name: string }
  ): Promise<ICategory> {
    try {
      const updateCategory = await this.prismaService.category.update({
        where: {
          id: category.id,
          AND: {
            userAttatchmentsId: userAttatchmentId,
          },
        },
        data: category,
      });

      return updateCategory;
    } catch (e) {
      if (e.code === "P2025") return null;
    }
  }

  async findById(userAttatchmentId: string, categoryId: string): Promise<ICategory> {
    const findCategory = await this.prismaService.category.findUnique({
      where: {
        id: categoryId,
        AND: {
          userAttatchmentsId: userAttatchmentId,
        },
      },
    });

    if (!findCategory) return null;

    return findCategory;
  }

  async findManyById(categoriesId: string[]): Promise<ICategory[]> {
    const findCategories = await this.prismaService.category.findMany({
      where: {
        id: { in: categoriesId },
      },
    });

    return findCategories;
  }
}
