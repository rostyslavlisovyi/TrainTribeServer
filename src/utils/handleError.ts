import { Response } from "express";
import mongoose from "mongoose";
import chalk from "chalk";
import {
  BaseError,
  NotFoundError,
  BadRequestError,
  DataCannotBeEmpty,
  MongoValidationError,
  MongoCastError,
  MongoDuplicateKeyError,
  DatabaseConnectionError,
  InternalServerError
} from "../errors/index.js";

export function handleError(res: Response, error: unknown) {
  console.error(chalk.red("Error:", error));

  if (error instanceof BaseError) {
    return res.status(error.statusCode).json(error.toJSON());
  }
  // Handle Client Errors
  if (error instanceof NotFoundError) {
    return res.status(404).json(error.toJSON());
  }
  if (error instanceof BadRequestError) {
    return res.status(400).json(error.toJSON());
  }
  if (error instanceof DataCannotBeEmpty) {
    return res.status(400).json(error.toJSON());
  }

  // Handle MongoDB Errors
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json(new MongoValidationError(error).toJSON());
  }
  if (error instanceof mongoose.Error.CastError) {
    return res.status(422).json(new MongoCastError(error).toJSON());
  }
  if (error instanceof mongoose.mongo.MongoServerError) {
    if (error.code === 11000) {
      return res.status(409).json(new MongoDuplicateKeyError(error).toJSON());
    }
  }

  // Handle Network Errors
  if (error instanceof Error) {
    if (
      error.message.includes("network") ||
      error.message.includes("connection")
    ) {
      return res
        .status(503)
        .json(new DatabaseConnectionError(error.message).toJSON());
    }
  }

  // Catch-all Fallback
  return res.status(500).json(new InternalServerError().toJSON());
}
