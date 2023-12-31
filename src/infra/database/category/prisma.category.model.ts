import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CategoryInterface } from "../../../category/category.interface";
import { ICategory } from "../../../@types/types";

@Injectable()
export class PrismaCategoryModel implements CategoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async create(categoryName: string): Promise<ICategory> {
    throw new Error("Method not implemented.");
  }

  async findByName(categoryName: string): Promise<ICategory> {
    throw new Error("Method not implemented.");
  }
}
