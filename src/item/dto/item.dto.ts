import {
  IsDefined,
  IsNumberString,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from "class-validator";

export class CreateItemDto {
  @IsString()
  @IsDefined({ message: "itemName can't be empty." })
  itemName: string;

  @IsDefined({ message: "description can't be empty." })
  @IsString()
  @MaxLength(500, { message: "description can't have more than 500 characters." })
  description?: string;

  @IsUUID()
  categoryId: string;
}

export class FilterByCategoryParamDto {
  @IsDefined({ message: "categoryId can't be empty." })
  @IsUUID()
  categoryId: string;

  @IsDefined()
  @IsNumberString()
  @Min(1, { message: "Page must be at least 1." })
  page: string;
}
