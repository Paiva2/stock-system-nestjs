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
import { IJwtSchema } from "../@types/types";
import {
  CreateItemDto,
  DeleteItemParamDto,
  EditItemDto,
  FilterByCategoryParamDto,
} from "./dto/item.dto";
import { AuthGuard } from "../infra/http/auth/auth.guard";
import { ItemService } from "./item.service";

@Controller()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

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

  @Get("/items")
  @UseGuards(AuthGuard)
  async getAllAccountItemsController(@Req() req: Request) {
    const tokenParsed: IJwtSchema = req["user"];

    const listItems = await this.itemService.listAllAcountItems(tokenParsed.sub);

    return { items: listItems };
  }

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
}
