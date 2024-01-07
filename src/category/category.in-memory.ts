import { randomUUID } from "crypto";
import { ICategory } from "../@types/types";
import { CategoryInterface } from "./category.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class InMemoryCategory implements CategoryInterface {
  private categories = [] as ICategory[];

  async create(userAttatchmentId: string, categoryName: string): Promise<ICategory> {
    const newCategory = {
      id: randomUUID(),
      name: categoryName,
      createdAt: new Date(),
      userAttatchmentsId: userAttatchmentId,
    };

    this.categories.push(newCategory);

    return newCategory;
  }

  async findByName(
    userAttatchmentId: string,
    categoryName: string
  ): Promise<ICategory> {
    const findCategory = this.categories.find(
      (category) =>
        category.name === categoryName &&
        category.userAttatchmentsId === userAttatchmentId
    );

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
    const totalCategories = this.categories.length;
    const perPage = 10;

    const findUserCategories = this.categories
      .filter((category) => category.userAttatchmentsId === userAttatchmentId)
      .splice((page - 1) * perPage, page * perPage);

    return {
      page,
      totalCategories,
      categories: findUserCategories,
    };
  }

  async delete(
    userAttatchmentId: string,
    categoryId: string
  ): Promise<ICategory | null> {
    const categoryToRemove = this.categories.find(
      (category) =>
        category.id === categoryId &&
        category.userAttatchmentsId === userAttatchmentId
    );

    if (!categoryToRemove) return null;

    const indexToDelete = this.categories.indexOf(categoryToRemove);

    this.categories.splice(indexToDelete, 1);

    return categoryToRemove;
  }

  async update(
    userAttatchmentId: string,
    category: { id: string; name: string }
  ): Promise<ICategory> {
    const findCategoryToUpdate = this.categories.find(
      (categoryUpdating) =>
        categoryUpdating.id === category.id &&
        categoryUpdating.userAttatchmentsId === userAttatchmentId
    );

    if (!findCategoryToUpdate) return null;

    const getCategoryToUpdateIdx = this.categories.indexOf(findCategoryToUpdate);

    const categoryUpdated = {
      ...findCategoryToUpdate,
      ...category,
    };

    this.categories.splice(getCategoryToUpdateIdx, 1, categoryUpdated);

    return categoryUpdated;
  }

  async findById(
    userAttatchmentId: string,
    categoryId: string
  ): Promise<ICategory | null> {
    const findCategory = this.categories.find(
      (category) =>
        category.id === categoryId &&
        category.userAttatchmentsId === userAttatchmentId
    );

    if (!findCategory) return null;

    return findCategory;
  }

  async findManyById(categoriesId: string[]): Promise<ICategory[]> {
    const findCategoriesWithIds = this.categories.filter((category) =>
      categoriesId.includes(category.id)
    );

    return findCategoriesWithIds;
  }
}
