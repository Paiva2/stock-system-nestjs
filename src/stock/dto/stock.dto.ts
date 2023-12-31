import { Type } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from "class-validator";

export class CreateStockDto {
  @IsString({ message: "stockName must be an string type" })
  @MinLength(5, { message: "stockName must have at least 5 characters" })
  stockName: string;
}

export class GetAllAccountStocksDto {
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: "Page must be at least 1." })
  page: number;
}

export class DeleteAccountStockDto {
  @IsUUID()
  stockId: string;
}

export class UpdateStockParamDto {
  @IsUUID()
  stockId: string;
}

export class UpdateStockDto {
  @IsOptional()
  @IsString({ message: "stockName must be an string type" })
  @MinLength(5, { message: "stockName must have at least 5 characters" })
  stockName: string;

  @IsOptional()
  @IsBoolean({ message: "active must be an boolean" })
  active: boolean;
}

export class GetStockByIdDto {
  @IsUUID()
  stockId: string;
}
