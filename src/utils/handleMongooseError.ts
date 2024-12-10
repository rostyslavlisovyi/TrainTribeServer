import mongoose from "mongoose";
import chalk from "chalk";
import { Error } from "sequelize";

const handleMongooseError = (error: unknown): void => {
  if (error instanceof mongoose.Error.ValidationError) {
    console.error(chalk.red("Validation Error:", error.errors));
    Object.values(error.errors).forEach((err) => {
      console.error(chalk.red(`Field: ${err.path}, Message: ${err.message}`));
    });
  } else if (error instanceof mongoose.Error.CastError) {
    console.error(chalk.red("Cast Error: Invalid ID format"));
  } else if (
    error instanceof mongoose.mongo.MongoServerError &&
    error.code === 11000
  ) {
    console.error(chalk.red("Duplicate Key Error:", error.keyValue));
  } else if (error instanceof Error) {
    console.error(chalk.red("General Error:", error.message));
  }
};

export default handleMongooseError;
