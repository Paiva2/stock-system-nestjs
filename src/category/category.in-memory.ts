import { randomUUID } from "crypto";
import { ICategory } from "../@types/types";
import { CategoryInterface } from "./category.interface";

export class InMemoryCategory implements CategoryInterface {
  private categories = [] as ICategory[];

  async create(categoryName: string): Promise<ICategory> {
    const newCategory = {
      id: randomUUID(),
      name: categoryName,
      createdAt: new Date(),
    };

    this.categories.push(newCategory);

    return newCategory;
  }

  async findByName(categoryName: string): Promise<ICategory> {
    const findCategory = this.categories.find(
      (category) => category.name === categoryName,
    );

    if (!findCategory) return null;

    return findCategory;
  }

  async getAll(page: number): Promise<{
    page: number;
    totalCategories: number;
    categories: ICategory[];
  }> {
    const totalCategories = this.categories.length;
    const perPage = 10;

    return {
      page,
      totalCategories,
      categories: this.categories.splice((page - 1) * perPage, page * perPage),
    };
  }

  async delete(categoryId: string): Promise<ICategory | null> {
    const categoryToRemove = this.categories.find(
      (category) => category.id === categoryId,
    );

    if (!categoryToRemove) return null;

    const indexToDelete = this.categories.indexOf(categoryToRemove);

    this.categories.splice(indexToDelete, 1);

    return categoryToRemove;
  }

  async update(category: { id: string; name: string }): Promise<ICategory> {
    const findCategoryToUpdate = this.categories.find(
      (categoryUpdating) => categoryUpdating.id === category.id,
    );

    if (!findCategoryToUpdate) return null;

    const getCategoryToUpdateIdx =
      this.categories.indexOf(findCategoryToUpdate);

    const categoryUpdated = {
      ...findCategoryToUpdate,
      ...category,
    };

    this.categories.splice(getCategoryToUpdateIdx, 1, categoryUpdated);

    return categoryUpdated;
  }
}
