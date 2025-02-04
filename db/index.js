import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import { configDotenv } from "dotenv";
configDotenv();
export const db = new Sequelize({
  dialect: PostgresDialect,
  database: process.env.DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  clientMinMessages: "notice",
});
