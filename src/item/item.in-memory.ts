import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { IITem } from "src/@types/types";
import { ItemInterface } from "./item.interface";
import { CategoryInterface } from "../category/category.interface";

@Injectable()
export class InMemoryItem implements ItemInterface {
  constructor(private readonly categoryInterface?: CategoryInterface) {}

  private items = [] as IITem[];

  async create(userAttatchmentId: string, item: IITem): Promise<IITem> {
    const { itemName, description, categoryId } = item;

    const newItem: IITem = {
      id: randomUUID(),
      itemName,
      description,
      categoryId,
      userAttatchmentsId: userAttatchmentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(newItem);

    return newItem;
  }

  async findAllByUserId(userAttatchmentId: string): Promise<IITem[]> {
    const filterByUserAttatchment = this.items.filter(
      (item) => item.userAttatchmentsId === userAttatchmentId
    );

    return filterByUserAttatchment;
  }

  async findById(userAttatchmentId: string, itemId: string): Promise<IITem | null> {
    const findItem = this.items.find(
      (item) => item.id === itemId && item.userAttatchmentsId === userAttatchmentId
    );
    if (!findItem) return null;

    const getItemCategory = await this.categoryInterface.findById(
      userAttatchmentId,
      findItem.categoryId
    );

    return {
      ...findItem,
      categoryName: getItemCategory.name,
    };
  }

  async filterManyByCategory(
    userAttatchmentId: string,
    categoryId: string,
    page: number
  ): Promise<IITem[]> {
    const perPage = 10;

    const filterByCategory = this.items
      .filter(
        (item) =>
          item.userAttatchmentsId === userAttatchmentId &&
          item.categoryId === categoryId
      )
      .splice((page - 1) * perPage, page * perPage);

    return filterByCategory;
  }

  async delete(userAttatchmentId: string, itemId: string): Promise<IITem> {
    const getItemToRemove = this.items.find(
      (item) => item.id === itemId && item.userAttatchmentsId === userAttatchmentId
    );

    if (!getItemToRemove) return null;

    const listUpdated = this.items.filter((item) => item.id !== getItemToRemove.id);

    this.items = listUpdated;

    return getItemToRemove;
  }

  async update(userAttatchmentId: string, item: IITem): Promise<IITem> {
    const updateItemsList = this.items.map((listItem) => {
      const isItemToUpdate =
        listItem.id === item.id && listItem.userAttatchmentsId === userAttatchmentId;

      if (isItemToUpdate) {
        listItem = {
          ...listItem,
          ...item,
        };
      }

      return listItem;
    });

    this.items = updateItemsList;

    const findItemToUpdate = this.items.find(
      (itemToUpdate) =>
        itemToUpdate.id === item.id &&
        itemToUpdate.userAttatchmentsId === userAttatchmentId
    );

    if (!findItemToUpdate) return null;

    return findItemToUpdate;
  }
}
