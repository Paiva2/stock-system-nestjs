import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserInterface } from "../user/user.interface";
import { CategoryInterface } from "./category.interface";
import { ICategory } from "../@types/types";

@Injectable()
export class CategoryService {
  constructor(
    private userInterface: UserInterface,
    private categoryInterface: CategoryInterface
  ) {}

  async create(userId: string, categoryName: string): Promise<ICategory> {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    const getUser = await this.userInterface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    const userAttatchmentId = getUser.userAttatchments[0].id;

    const hasCategoryCreated = await this.categoryInterface.findByName(
      userAttatchmentId,
      categoryName
    );

    if (hasCategoryCreated) {
      throw new ConflictException("An category with this name already exists.");
    }

    const createCategory = await this.categoryInterface.create(
      userAttatchmentId,
      categoryName
    );

    return createCategory;
  }

  async getAllCategories(
    userId: string,
    page = 1
  ): Promise<{
    page: number;
    totalCategories: number;
    categories: ICategory[];
  }> {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    if (page < 1) page = 1;

    const getUser = await this.userInterface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    const categories = await this.categoryInterface.getAll(
      page,
      getUser.userAttatchments[0].id
    );

    return categories;
  }

  async deleteCategory(userId: string, categoryId: string): Promise<ICategory> {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    if (!categoryId) {
      throw new BadRequestException("Invalid category id.");
    }

    const getUser = await this.userInterface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    const deleteCategory = await this.categoryInterface.delete(
      getUser.userAttatchments[0].id,
      categoryId
    );

    if (!deleteCategory) {
      throw new NotFoundException("Category not found.");
    }

    return deleteCategory;
  }

  async updateCategory(
    userId: string,
    categoryUpdate: { id: string; name: string }
  ): Promise<ICategory> {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    if (!categoryUpdate.id) {
      throw new BadRequestException("Invalid category id.");
    }

    const getUser = await this.userInterface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    if (getUser.role !== "admin") {
      throw new ForbiddenException("Invalid permissions.");
    }

    const userAttatchmentId = getUser.userAttatchments[0].id;

    const hasACategoryWithThisName = await this.categoryInterface.findByName(
      userAttatchmentId,
      categoryUpdate.name
    );

    if (hasACategoryWithThisName) {
      throw new ConflictException("An category with this name already exists.");
    }

    const updateCategoryName = await this.categoryInterface.update(
      userAttatchmentId,
      categoryUpdate
    );

    if (!updateCategoryName) {
      throw new NotFoundException("Category not found.");
    }

    return updateCategoryName;
  }
}
