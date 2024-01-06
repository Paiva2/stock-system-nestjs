import { ICategory } from "../@types/types";

export abstract class CategoryInterface {
  abstract create(
    userAttatchmentId: string,
    categoryName: string
  ): Promise<ICategory>;

  abstract findByName(
    userAttatchmentsId: string,
    categoryName: string
  ): Promise<ICategory | null>;

  abstract getAll(page: number): Promise<{
    page: number;
    totalCategories: number;
    categories: ICategory[];
  }>;

  abstract delete(categoryId: string): Promise<ICategory | null>;

  abstract update(category: { id: string; name: string }): Promise<ICategory>;

  abstract findById(categoryId: string): Promise<ICategory | null>;

  abstract findManyById(categoriesId: string[]): Promise<ICategory[]>;
}
