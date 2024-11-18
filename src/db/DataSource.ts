import { DataSource } from "typeorm";
import { Dealer } from "./entities";

const port = Number(process.env.DB_PORT) || 5432

export const dataSource: DataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port,
  username: process.env.DB_USERNAME ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  schema: "dealer_service",
  database: "dealer_service",
  synchronize: true,
  logging: true,
  entities: [
    Dealer
  ],
  subscribers: [],
  migrations: [],
})
