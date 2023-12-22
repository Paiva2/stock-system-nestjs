import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TestsModule } from './tests/tests.module';

@Module({
  imports: [UserModule, TestsModule],
})
export class AppModule {}
