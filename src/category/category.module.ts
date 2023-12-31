import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { PrismaModule } from "../infra/database/prisma.module";
import { AuthModule } from "../infra/http/auth/auth.module";
import { UserInterface } from "../user/user.interface";
import { PrismaUserModel } from "../infra/database/user/prisma.user.model";
import { CategoryInterface } from "./category.interface";
import { PrismaCategoryModel } from "../infra/database/category/prisma.category.model";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CategoryController],
  providers: [
    {
      provide: UserInterface,
      useClass: PrismaUserModel,
    },
    {
      provide: CategoryInterface,
      useClass: PrismaCategoryModel,
    },
    CategoryService,
  ],
})
export class CategoryModule {}
