import { IsOptional, IsString, IsUUID, Min, MinLength } from "class-validator";

export class CreateCategoryDto {
  @MinLength(3, { message: "categoryName must have at least 3 characters." })
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

export class UpdateCategoryDto {
  @IsUUID()
  id: string;

  @IsString()
  @MinLength(3, { message: "name must have at least 3 characters" })
  name: string;
}
