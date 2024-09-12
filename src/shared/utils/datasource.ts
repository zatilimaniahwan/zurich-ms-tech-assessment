import { registerAs } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { join } from "path";

const dbConfig = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "admin",
  password: "password",
  database: "MOTOR_INSURANCE_WEBSITE",
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  migrations: [join(__dirname, "/../../", "database/migrations/**/*{.ts,.js}")],
  synchronize: false,
  autoLoadEntities: true,
  migrationsRun: false,
};

export default registerAs("typeorm", () => dbConfig);
export const dataSource = new DataSource(dbConfig as DataSourceOptions);
