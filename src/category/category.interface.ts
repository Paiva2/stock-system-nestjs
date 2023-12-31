import { ICategory } from "../@types/types";

export abstract class CategoryInterface {
  abstract create(categoryName: string): Promise<ICategory>;

  abstract findByName(categoryName: string): Promise<ICategory | null>;
}
