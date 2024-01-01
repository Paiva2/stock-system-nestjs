import { IsOptional, IsString, IsUUID, Min, MinLength } from "class-validator";

export class CreateCategoryDto {
  @MinLength(1, { message: "categoryName can't be empty." })
  @IsString()
  categoryName: string;
}

export class GetAllCategoriesQueryDto {
  @IsOptional()
  @IsString()
  @Min(1, { message: "Page must be higher than 1." })
  page: string;
}

export class DeleteCategoryParamDto {
  @IsUUID()
  categoryId: string;
}
