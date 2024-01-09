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
  CreateCategoryDto,
  DeleteCategoryParamDto,
  FilterCategoryByNameQueryDto,
  FilterCategoryDto,
  GetAllCategoriesQueryDto,
  UpdateCategoryDto,
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
    @Req() req: Request
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    await this.categoryService.create(
      tokenParsed.sub,
      createCategoryDto.categoryName
    );

    return { message: "Category successfully created." };
  }

  @Get("/category") // ?categoryName=
  @UseGuards(AuthGuard)
  async filterCategoryByNameController(
    @Query(ValidationPipe)
    filterCategoryByNameQueryDto: FilterCategoryByNameQueryDto,
    @Req() req: Request
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    const { categoryName } = filterCategoryByNameQueryDto;

    if (categoryName) {
      const findByName = await this.categoryService.filterCategoryByName(
        tokenParsed.sub,
        categoryName
      );

      return findByName;
    }
  }

  @Get("/categories")
  @UseGuards(AuthGuard)
  async getAllCategoriesController(
    @Query() query: GetAllCategoriesQueryDto,
    @Req() req: Request
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    const page = query.page ? +query.page : 1;

    const getCategories = await this.categoryService.getAllCategories(
      tokenParsed.sub,
      page
    );

    return getCategories;
  }

  @Get("/category/:categoryId")
  @UseGuards(AuthGuard)
  async filterCategoryById(
    @Param() filterCategoryDto: FilterCategoryDto,
    @Req() req: Request
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    const { categoryId } = filterCategoryDto;

    const getCategory = await this.categoryService.filterCategoryById(
      tokenParsed.sub,
      categoryId
    );

    return getCategory;
  }

  @Delete("/categories/delete/:categoryId")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteCategoryController(
    @Param() params: DeleteCategoryParamDto,
    @Req() req: Request
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    await this.categoryService.deleteCategory(tokenParsed.sub, params.categoryId);

    return { message: "Category successfully deleted." };
  }

  @Patch("/category")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateCategoryController(
    @Body(ValidationPipe) updateCategoryControllerDto: UpdateCategoryDto,
    @Req() req: Request
  ) {
    const tokenParsed: IJwtSchema = req["user"];

    await this.categoryService.updateCategory(
      tokenParsed.sub,
      updateCategoryControllerDto
    );

    return { message: "Category successfully updated." };
  }
}
