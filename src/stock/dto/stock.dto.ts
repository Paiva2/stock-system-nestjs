import { Type } from "class-transformer";
import { IsInt, IsString, IsUUID, Min, MinLength } from "class-validator";

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

export class GetStockByIdDto {
  @IsUUID()
  stockId: string;
}
