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
}
