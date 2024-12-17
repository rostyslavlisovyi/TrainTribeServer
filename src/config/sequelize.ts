import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import mysql2 from 'mysql2';
dotenv.config();

const processingMode = process.env.NODE_ENV;

const sequelize = new Sequelize(
  process.env.MYSQL_DB_NAME ?? "",
  process.env.MYSQL_DB_USER ?? "",
  process.env.MYSQL_DB_PASSWORD ?? "",
  {
    host: process.env.MYSQL_DB_HOST || "localhost",
    dialect: "mysql",
    dialectModule: mysql2,
    logging: processingMode === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;
