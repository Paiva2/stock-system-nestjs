import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { Request } from "express";
import { IJwtSchema } from "../@types/types";
import {
  CreateCategoryDto,
  GetAllCategoriesQueryDto,
} from "./dto/category.dto";
import { AuthGuard } from "../infra/http/auth/auth.guard";
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

  @Get("/categories")
  @UseGuards(AuthGuard)
  async getAllCategoriesController(
    @Query() query: GetAllCategoriesQueryDto,
    @Req() req: Request,
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    const page = query.page ? +query.page : 1;

    const getCategories = await this.categoryService.getAllCategories(
      tokenParsed.sub,
      page,
    );

    return getCategories;
  }
}
