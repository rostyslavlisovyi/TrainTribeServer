import {
  ValidationError,
  UniqueConstraintError,
  DatabaseError,
  TimeoutError
} from "sequelize";
import chalk from "chalk";

const handleSequelizeError = (error: unknown): void => {
  if (error instanceof ValidationError) {
    console.log(
      chalk.red(
        "Validation Error:",
        error.errors.map((e) => e.message)
      )
    );
  } else if (error instanceof UniqueConstraintError) {
    console.log(
      chalk.red(
        "Unique Constraint Error:",
        error.errors.map((e) => e.message)
      )
    );
  } else if (error instanceof DatabaseError) {
    console.log(chalk.red("Database Error:", error.message));
  } else if (error instanceof TimeoutError) {
    console.log(chalk.red("Timeout Error:", error));
  }
};

export default handleSequelizeError;
