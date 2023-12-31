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

  abstract getAll(
    page: number,
    userAttatchmentId: string
  ): Promise<{
    page: number;
    totalCategories: number;
    categories: ICategory[];
  }>;

  abstract delete(
    userAttatchmentId: string,
    categoryId: string
  ): Promise<ICategory | null>;

  abstract update(
    userAttatchmentId: string,
    category: { id: string; name: string }
  ): Promise<ICategory>;

  abstract findById(
    userAttatchmentId: string,
    categoryId: string
  ): Promise<ICategory | null>;

  abstract findManyById(categoriesId: string[]): Promise<ICategory[]>;
}
