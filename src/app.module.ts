import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ProductsModule } from "./products/products.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { dataSource } from "./shared/utils/data-source";
import { JwtModule } from "@nestjs/jwt";
import { RoleMiddleware } from "./middleware/role.middleware";
import { JwtStrategy } from "./jwt/jwt.strategy";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigService available globally
      envFilePath: ".env", // Specifies the .env file location
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: dataSource, // Load TypeORM configuration using factory function
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1d" },
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RoleMiddleware)
      .exclude("/products/get")
      .forRoutes("/products/create", "/products/update", "/products/remove");
  }
}
