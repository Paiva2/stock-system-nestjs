import { IsString, MinLength } from "class-validator";

export class CreateStockDto {
  @IsString({ message: "stockName must be an string type" })
  @MinLength(5, { message: "stockName must have at least 5 characters" })
  stockName: string;
}
