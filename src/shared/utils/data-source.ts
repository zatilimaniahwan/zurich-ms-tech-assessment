import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Product } from "../../products/entities/product.entity";
import { ConfigService } from "@nestjs/config";

/**
 * Generates the TypeORM module options based on the environment variables.
 *
 * @param {ConfigService} configService - The ConfigService instance.
 * @returns {TypeOrmModuleOptions} - The TypeORM module options.
 */
export const dataSource = (
  configService: ConfigService
): TypeOrmModuleOptions => ({
  type: configService.get<any>("DB_TYPE"),
  host: configService.get<string>("DB_HOST"),
  port: parseInt(configService.get<string>("DB_PORT"), 10),
  username: configService.get<string>("DB_USERNAME"),
  password: configService.get<string>("DB_PASSWORD"),
  database: configService.get<string>("DB_NAME"),
  entities: [Product],
  synchronize: configService.get<boolean>("DB_SYNCHRONIZE"),
});
