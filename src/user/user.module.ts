import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { PrismaUserModel } from '../database/prisma.user.model';
import { UserController } from './user.controller';
import { UserInterface } from './user.interface';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    { provide: UserInterface, useClass: PrismaUserModel },
    UserService,
  ],
})
export class UserModule {}
