import { IsString, MinLength } from "class-validator";

export class CreateCategoryDto {
  @MinLength(1, { message: "categoryName can't be empty." })
  @IsString()
  categoryName: string;
}
