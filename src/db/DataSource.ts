import { DataSource, DataSourceOptions } from "typeorm";
import { Dealer } from "./entity";
import { config } from "dotenv";
import { WinstonAdaptor } from "typeorm-logger-adaptor";
import logger from "../infrastructure/logger";

// init process.env for typeorm CLI
config();

const port = parseInt(process.env.DB_PORT!, 10)

const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST!,
  port,
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  schema: process.env.DB_SCHEMA!,
  database: process.env.DB_NAME!,
  synchronize: false,
  logger: new WinstonAdaptor(logger, 'all', true),
  entities: [
    Dealer
  ],
  subscribers: [
  ],
  migrations: [
    __dirname + '/migration/**/*.{js,ts}'
  ],
  migrationsTableName: "typeorm_migrations",
}

const dataSource = new DataSource(dataSourceOptions)

dataSource.initialize()
    .then(() => {
        // here you can start to work with your database
    })
    .catch((error) => console.log(error))

export default dataSource
