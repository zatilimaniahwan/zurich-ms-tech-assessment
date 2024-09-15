import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Product } from "src/products/entities/product.entity";
import { ConfigService } from "@nestjs/config";

export const dataSource = (
  configService: ConfigService
): TypeOrmModuleOptions => ({
  type: configService.get<any>("DB_TYPE"),
  host: configService.get<string>("DB_HOST"),
  port: parseInt(configService.get<string>("DB_PORT"), 10),
  username: configService.get<string>("DB_USERNAME"),
  password: configService.get<string>("DB_PASSWORD"),
  database: configService.get<string>("DB_NAME"),
  entities: [Product], // Include your Product entity here
  synchronize: configService.get<boolean>("DB_SYNCHRONIZE"), // true or false, from the env file
});
