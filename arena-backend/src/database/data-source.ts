import 'dotenv/config';
import { DataSource } from 'typeorm';
import { buildDataSourceOptions } from './typeorm.config';

const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined;

const AppDataSource = new DataSource(
  buildDataSourceOptions({
    host: process.env.DB_HOST,
    port,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }),
);

export default AppDataSource;
