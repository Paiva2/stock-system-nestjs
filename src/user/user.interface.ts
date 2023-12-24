import { IUser, IUserCreation } from 'src/@types/types';
export abstract class UserInterface {
  abstract create({ email, fullName, password }: IUserCreation): Promise<IUser>;

  abstract findByEmail(email: string): Promise<IUser | null>;
}
