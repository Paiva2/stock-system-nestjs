import { IUser, IUserCreation } from "src/@types/types";
export abstract class UserInterface {
  abstract create({ email, fullName, password }: IUserCreation): Promise<IUser>;

  abstract findByEmail(email: string): Promise<IUser | null>;

  abstract findById(userId: string): Promise<IUser | null>;

  abstract updatePassword(
    userEmail: string,
    newPassword: string,
  ): Promise<IUser>;
}
