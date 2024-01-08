import { IITem } from "src/@types/types";

export abstract class ItemInterface {
  abstract create(userAttatchmentId: string, item: IITem): Promise<IITem>;

  abstract findAllByUserId(userAttatchmentId: string): Promise<IITem[]>;

  abstract findById(
    userAttatchmentId: string,
    itemId: string
  ): Promise<IITem | null>;

  abstract filterManyByCategory(
    userAttatchmentId: string,
    categoryId: string,
    page: number
  ): Promise<IITem[]>;
}
