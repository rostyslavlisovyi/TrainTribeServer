import * as Sentry from "@sentry/node";
import type { Request } from "express";
import { Response } from "express";
import mongoose from "mongoose";
import chalk from "chalk";
import {
  BaseError,
  MongoValidationError,
  MongoCastError,
  MongoDuplicateKeyError,
  DatabaseConnectionError,
  InternalServerError
} from "../errors/index.js";

function buildErrorContext(req?: Request) {
  if (!req) {
    return undefined;
  }

  const user =
    req.auth?.payload?.sub ??
    req.auth?.payload?.user_id ??
    req.auth?.payload?.aud;

  return {
    method: req.method,
    path: req.originalUrl,
    user
  } as const;
}

export function handleError(
  res: Response,
  req: Request | undefined,
  error: unknown
) {
  const context = buildErrorContext(req);
  const shouldReport = !(error instanceof BaseError && error.statusCode < 500);

  if (shouldReport) {
    Sentry.captureException(error, {
      extra: context
    });
  }

  console.error(chalk.red("Error:"), context ?? "", error);

  if (error instanceof BaseError) {
    return res.status(error.statusCode).json(error.toJSON());
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
  const fallback = new InternalServerError();
  return res.status(fallback.statusCode).json(fallback.toJSON());
}
