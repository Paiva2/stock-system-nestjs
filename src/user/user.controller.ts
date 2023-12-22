import { Controller, Post } from '@nestjs/common';

@Controller()
export class UserController {
  @Post('/register')
  async registerUserController() {}
}
