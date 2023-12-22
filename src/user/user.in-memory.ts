import { IUserCreation, IUser } from 'src/@types/types';
import { UserInterface } from './user.interface';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class InMemoryUser implements UserInterface {
  private users = [] as IUser[];

  async create({ email, fullName, password }: IUserCreation): Promise<IUser> {
    const newUser = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'default',
      fullName,
      email,
      password,
    };

    this.users.push(newUser);

    return newUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const findUser = this.users.find((user) => user.email === email);

    if (!findUser) return null;

    return findUser;
  }
}
