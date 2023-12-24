import {
  ConflictException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { IUser, IUserCreation } from 'src/@types/types';
import { hash } from 'bcrypt';
import { UserInterface } from './user.interface';

@Injectable()
export class UserService {
  constructor(private readonly userInterface: UserInterface) {}

  async registerUserService(user: IUserCreation): Promise<IUser> {
    if (!user.fullName) {
      throw new BadRequestException('Full name must be provided.');
    }

    if (!user.email) {
      throw new BadRequestException('E-mail must be provided.');
    }

    if (user.password.length < 6) {
      throw new BadRequestException(
        'Password must have at least 6 characters.',
      );
    }

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
