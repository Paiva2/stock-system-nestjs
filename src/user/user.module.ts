import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { InMemoryUser } from './user.in-memory';

@Module({
  imports: [UserModule],
  controllers: [UserController],
  providers: [UserService, InMemoryUser],
  exports: [UserModule],
})
export class UserModule {}
