import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./infra/http/auth/auth.module";
import { StockModule } from "./stock/stock.module";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    UserModule,
    AuthModule,
    StockModule,
  ],
})
export class AppModule {}
