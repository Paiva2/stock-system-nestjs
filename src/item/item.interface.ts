import { IITem } from "src/@types/types";

export abstract class ItemInterface {
  abstract create(userId: string, item: IITem): Promise<IITem>;
}
