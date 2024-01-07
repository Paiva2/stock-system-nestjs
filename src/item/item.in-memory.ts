import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { IITem } from "src/@types/types";
import { ItemInterface } from "./item.interface";

@Injectable()
export class InMemoryItem implements ItemInterface {
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

    return findItem;
  }
}
