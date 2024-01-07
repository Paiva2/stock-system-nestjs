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

class StockItemDto {
  @IsString()
  @Min(1, { message: "itemName can't be empty." })
  itemName: string;

  @IsNumberString()
  @Min(1, { message: "quantity must be at least 1." })
  quantity: string;

  @IsUUID()
  stockId: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: "description can't have more than 500 characters." })
  description: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsUUID()
  itemId: string;
}

export class InsertStockItemDto {
  @IsUUID()
  stockId: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => StockItemDto)
  stockItem: StockItemDto;
}

export class RemoveStockItemBodyDto {
  @IsUUID()
  stockId: string;
}

export class RemoveStockItemParamDto {
  @IsUUID()
  stockItemId: string;
}

class StockItemUpdateDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  @Min(1, { message: "itemName can't be empty." })
  itemName?: string;

  @IsOptional()
  @IsNumberString()
  @Min(1, { message: "quantity must be at least 1." })
  quantity?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: "description can't have more than 500 characters." })
  description?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

export class EditStockItemDto {
  @IsUUID()
  stockId: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => StockItemUpdateDto)
  stockItem: StockItemUpdateDto;
}
