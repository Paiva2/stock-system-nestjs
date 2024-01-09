import { Type } from "class-transformer";
import {
  IsDefined,
  IsNotEmptyObject,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
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

export class EditItem {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  itemName: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: "description can't have more than 500 characters." })
  description?: string;

  @IsOptional()
  @IsUUID()
  categoryId: string;
}

export class EditItemDto {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => EditItem)
  item: EditItem;
}

export class FilterByCategoryParamDto {
  @IsDefined()
  @IsUUID()
  category: string;

  @IsDefined()
  @IsNumberString()
  page: string;
}

export class DeleteItemParamDto {
  @IsDefined()
  @IsUUID()
  itemId: string;
}

export class GetItemByIdDto {
  @IsDefined({ message: "itemId can't be empty." })
  @IsUUID()
  itemId: string;
}
