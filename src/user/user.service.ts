import { ConflictException, Injectable } from '@nestjs/common';
import { UserInterface } from './user.interface';
import { IUser, IUserCreation } from 'src/@types/types';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userInterface: UserInterface) {}

  async registerUserService(user: IUserCreation): Promise<IUser> {
    const isUserRegistered = await this.userInterface.findByEmail(user.email);

    if (isUserRegistered) {
      throw new ConflictException('User is already registered.');
    }

    const hashPassword = await hash(user.password, 8);

    const createUser = await this.userInterface.create({
      ...user,
      password: hashPassword,
    });

    return createUser;
  }
}
