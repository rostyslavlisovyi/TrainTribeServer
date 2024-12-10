import chalk from "chalk";

import handleMongooseError from "./handleMongooseError.js";
import handleSequelizeError from "./handleSequelizeError.js";

import { Response } from "express";
import { DBType } from "../config/database.js";

const dbType: DBType = process.env.DB_TYPE as DBType;
const handleError = (
  res: Response,
  error: unknown,
  message = "INTERNAL SERVER ERROR"
): void => {
  if (dbType === "mongodb") {
    handleMongooseError(error);
  } else if (dbType === "mysql") {
    handleSequelizeError(error);
  }
  console.error(chalk.red(`${message}`, error));
  res.status(500).json({ message });
};

export default handleError;
