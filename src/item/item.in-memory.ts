import { IITem } from "src/@types/types";
import { ItemInterface } from "./item.interface";
import { randomUUID } from "crypto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class InMemoryItem implements ItemInterface {
  private items = [] as IITem[];

  async create(userId: string, item: IITem): Promise<IITem> {
    const { itemName, description, categoryId } = item;

    const newItem = {
      id: randomUUID(),
      itemName,
      description,
      categoryId,
      userAttatchmentsId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(newItem);

    return newItem;
  }
}
