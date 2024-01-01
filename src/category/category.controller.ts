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
import { AuthGuard } from "../infra/http/auth/auth.guard";
import { CreateCategoryDto } from "./dto/category.dto";
import { CategoryService } from "./category.service";

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post("/category")
  @UseGuards(AuthGuard)
  async createCategoryController(
    @Body(ValidationPipe) createCategoryDto: CreateCategoryDto,
    @Req() req: Request,
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    await this.categoryService.create(
      tokenParsed.sub,
      createCategoryDto.categoryName,
    );

    return { message: "Category successfully created." };
  }
}
