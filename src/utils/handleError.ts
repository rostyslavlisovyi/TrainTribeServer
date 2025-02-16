import chalk from "chalk";
import handleMongooseError from "./handleMongooseError.js";
import { Response } from "express";

const handleError = (
  res: Response,
  error: unknown,
  message = "INTERNAL SERVER ERROR"
): void => {
  handleMongooseError(error);
  console.error(chalk.red(`${message}`, error));
  res.status(500).json({ message });
};

export default handleError;
