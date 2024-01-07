import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { Request } from "express";
import { IJwtSchema } from "../@types/types";
import { CreateItemDto } from "./dto/item.dto";
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
}
