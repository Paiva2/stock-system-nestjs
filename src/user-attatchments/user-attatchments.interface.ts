import { IUserAttatchments } from "../@types/types";

export abstract class UserAttatchmentsInterface {
  abstract create(userId: string): Promise<IUserAttatchments>;
}
