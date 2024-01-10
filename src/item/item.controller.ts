import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { Request } from "express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { IJwtSchema } from "../@types/types";
import {
  CreateItemDto,
  DeleteItemParamDto,
  EditItemDto,
  FilterByCategoryParamDto,
  GetItemByIdDto,
} from "./dto/item.dto";
import { AuthGuard } from "../infra/http/auth/auth.guard";
import { ItemService } from "./item.service";
@ApiTags("Item")
@Controller()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @ApiBody({
    type: CreateItemDto,
    examples: {
      createItemDto: {
        value: {
          itemName: "My Item",
          description: "My item description",
          categoryId: "One valid cateogory id",
        },
      },
    },
  })
  @ApiBearerAuth()
  @Post("/item")
  @UseGuards(AuthGuard)
  async createItemController(
    @Body(ValidationPipe) createItemDto: CreateItemDto,
    @Req() req: Request
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    await this.itemService.createItem(tokenParsed.sub, createItemDto);

    return { message: "Item successfully created." };
  }

  @ApiParam({
    name: "itemId",
    allowEmptyValue: false,
    example: "itemId",
  })
  @ApiBearerAuth()
  @Delete("/item/:itemId")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteItemController(
    @Req() req: Request,
    @Param() deleteItemDto: DeleteItemParamDto
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    await this.itemService.deleteItem(tokenParsed.sub, deleteItemDto.itemId);

    return { message: "Item successfully removed." };
  }

  @ApiBearerAuth()
  @Get("/items")
  @UseGuards(AuthGuard)
  async getAllAccountItemsController(@Req() req: Request) {
    const tokenParsed: IJwtSchema = req["user"];

    const listItems = await this.itemService.listAllAcountItems(tokenParsed.sub);

    return { items: listItems };
  }

  @ApiQuery({
    name: "page",
    type: Number,
    required: true,
    example: "1",
  })
  @ApiQuery({
    name: "category",
    type: String,
    required: true,
    example: "categoryId",
  })
  @ApiBearerAuth()
  @Get("/items/filter") //?category=categoryId?page=
  @UseGuards(AuthGuard)
  async filterByCategoryController(
    @Req() req: Request,
    @Query(ValidationPipe) filterByCategoryQueryDto: FilterByCategoryParamDto
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    const { category, page } = filterByCategoryQueryDto;

    const listItems = await this.itemService.filterByCategory(
      tokenParsed.sub,
      category,
      +page
    );

    return listItems;
  }

  @ApiBody({
    type: EditItemDto,
    examples: {
      editItemDto: {
        value: {
          id: "item to edit id",
          itemName: "new item name",
          description: "new item description",
          categoryId: "new category id",
        },
      },
    },
  })
  @ApiBearerAuth()
  @Patch("/item")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async editItemController(
    @Req() req: Request,
    @Body(ValidationPipe) editITemDto: EditItemDto
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    const { item } = editITemDto;

    await this.itemService.editItem(tokenParsed.sub, item);

    return { message: "Item successfully updated." };
  }

  @ApiParam({
    name: "itemId",
    allowEmptyValue: false,
    example: "itemId",
  })
  @Get("/item/:itemId")
  @UseGuards(AuthGuard)
  async getItemByIdController(
    @Req() req: Request,
    @Param(ValidationPipe) getItemByIdDto: GetItemByIdDto
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    const { itemId } = getItemByIdDto;

    const getItem = await this.itemService.getItemById(tokenParsed.sub, itemId);

    return getItem;
  }
}
