import { Module } from "@nestjs/common";
import { PrismaModule } from "src/infra/database/prisma.module";
import { AuthModule } from "src/infra/http/auth/auth.module";
import { PrismaUserModel } from "../infra/database/user/prisma.user.model";
import { PrismaCategoryModel } from "../infra/database/category/prisma.category.model";
import { PrismaItemModel } from "../infra/database/item/prisma.item.model";
import { ItemInterface } from "./item.interface";
import { CategoryInterface } from "../category/category.interface";
import { UserInterface } from "../user/user.interface";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ItemController],
  providers: [
    { provide: UserInterface, useClass: PrismaUserModel },
    { provide: CategoryInterface, useClass: PrismaCategoryModel },
    { provide: ItemInterface, useClass: PrismaItemModel },
    ItemService,
  ],
  exports: [ItemService],
})
export class ItemModule {}
