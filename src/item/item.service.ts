import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { IITem } from "../@types/types";
import { CategoryInterface } from "../category/category.interface";
import { UserInterface } from "../user/user.interface";
import { ItemInterface } from "./item.interface";

@Injectable()
export class ItemService {
  constructor(
    private readonly userInteface: UserInterface,
    private readonly categoryInterface: CategoryInterface,
    private readonly itemInterface: ItemInterface
  ) {}

  async createItem(userId: string, item: IITem): Promise<IITem> {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    if (!item.categoryId) {
      throw new BadRequestException("Invalid category id.");
    }

    const getUser = await this.userInteface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    const getCategory = await this.categoryInterface.findById(
      getUser.userAttatchments[0].id,
      item.categoryId
    );

    if (!getCategory) {
      throw new NotFoundException("Category not found.");
    }

    const newItem = await this.itemInterface.create(
      getUser.userAttatchments[0].id,
      item
    );

    return newItem;
  }

  async deleteItem(userId: string, itemId: string): Promise<IITem> {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    const getUser = await this.userInteface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    const deleteItem = await this.itemInterface.delete(
      getUser.userAttatchments[0].id,
      itemId
    );

    if (!deleteItem) {
      throw new NotFoundException("Item not found.");
    }

    return deleteItem;
  }

  async editItem(userId: string, item: Partial<IITem>): Promise<IITem> {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    if (!item.id) {
      throw new BadRequestException("Invalid item id.");
    }

    const getUser = await this.userInteface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    if (item.categoryId) {
      const findCategory = await this.categoryInterface.findById(
        getUser.userAttatchments[0].id,
        item.categoryId
      );

      if (!findCategory) {
        throw new NotFoundException("Category not found.");
      }
    }

    const editItem = await this.itemInterface.update(
      getUser.userAttatchments[0].id,
      item
    );

    if (!editItem) {
      throw new NotFoundException("Item not found.");
    }

    return editItem;
  }

  async listAllAcountItems(userId: string): Promise<IITem[]> {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    const getUser = await this.userInteface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    const getAllItems = await this.itemInterface.findAllByUserId(
      getUser.userAttatchments[0].id
    );

    return getAllItems;
  }

  async filterByCategory(
    userId: string,
    categoryId: string,
    page: number
  ): Promise<{
    items: IITem[];
    categoryName: string;
    page: number;
    totalItems: number;
  }> {
    if (page < 1 || !page) page = 1;

    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    const getUser = await this.userInteface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    const getCategory = await this.categoryInterface.findById(
      getUser.userAttatchments[0].id,
      categoryId
    );

    if (!getCategory) {
      throw new NotFoundException("Category not found.");
    }

    const filterItem = await this.itemInterface.filterManyByCategory(
      getUser.userAttatchments[0].id,
      categoryId,
      page
    );

    return {
      page,
      totalItems: filterItem.length,
      categoryName: getCategory.name,
      items: filterItem,
    };
  }

  async getItemById(userId: string, itemId: string): Promise<IITem> {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }

    if (!itemId) {
      throw new BadRequestException("Invalid item id.");
    }

    const getUser = await this.userInteface.findById(userId);

    if (!getUser) {
      throw new NotFoundException("User not found.");
    }

    const getItem = await this.itemInterface.findById(
      getUser.userAttatchments[0].id,
      itemId
    );

    if (!getItem) {
      throw new NotFoundException("Item not found.");
    }

    return getItem;
  }
}
