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
}
