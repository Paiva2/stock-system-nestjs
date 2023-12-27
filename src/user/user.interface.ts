import { IUser, IUserCreation, IUserUpdate } from "src/@types/types";
export abstract class UserInterface {
  abstract create({ email, fullName, password }: IUserCreation): Promise<IUser>;

  abstract findByEmail(email: string): Promise<IUser | null>;

  abstract findById(userId: string): Promise<IUser | null>;

  abstract updatePassword(
    userEmail: string,
    newPassword: string,
  ): Promise<IUser>;

  abstract update(userId: string, update: IUserUpdate): Promise<IUser>;
}
