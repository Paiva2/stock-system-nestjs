import { Injectable } from '@nestjs/common';
import { IUser, IUserCreation } from 'src/@types/types';

@Injectable()
export abstract class UserInterface {
  abstract create({ email, fullName, password }: IUserCreation): Promise<IUser>;

  abstract findByEmail(email: string): Promise<IUser | null>;
}
