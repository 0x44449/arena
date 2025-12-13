import { join } from "path";
import type { DataSourceOptions } from "typeorm";

const entitiesPath = join(__dirname, "..", "**", "*.entity.{ts,js}");
const migrationsPath = join(__dirname, "..", "migrations", "*{.ts,.js}");

type ConnectionOptions = {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
};

export function buildDataSourceOptions(options: ConnectionOptions): DataSourceOptions {
  return {
    type: "postgres",
    host: options.host,
    port: options.port ?? 5432,
    username: options.username,
    password: options.password,
    database: options.database,
    synchronize: false,
    logging: ["error", "warn"],
    entities: [entitiesPath],
    migrations: [migrationsPath],
  };
}
