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
  CreateCategoryDto,
  DeleteCategoryParamDto,
  FilterCategoryByNameQueryDto,
  FilterCategoryDto,
  GetAllCategoriesQueryDto,
  UpdateCategoryDto,
} from "./dto/category.dto";
import { AuthGuard } from "../infra/http/auth/auth.guard";
import { CategoryService } from "./category.service";
@ApiTags("Category")
@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBody({
    type: CreateCategoryDto,
    examples: {
      createCategoryDto: {
        value: {
          categoryName: "Fruits",
        },
      },
    },
  })
  @ApiBearerAuth()
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

  @ApiQuery({
    name: "categoryName",
    type: String,
    required: false,
    example: "Fruits",
  })
  @ApiBearerAuth()
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

  @ApiQuery({
    name: "page",
    type: Number,
    required: true,
    example: "1",
  })
  @ApiBearerAuth()
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

  @ApiParam({
    name: "categoryId",
    allowEmptyValue: false,
    example: "categoryId",
  })
  @ApiBearerAuth()
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

  @ApiParam({
    name: "categoryId",
    allowEmptyValue: false,
    example: "categoryId",
  })
  @ApiBearerAuth()
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

  @ApiBody({
    type: UpdateCategoryDto,
    examples: {
      updateCategoryDto: {
        value: {
          id: "my category id",
          name: "new category name",
        },
      },
    },
  })
  @ApiBearerAuth()
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
