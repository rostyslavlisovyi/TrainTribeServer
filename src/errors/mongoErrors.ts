import mongoose from "mongoose";
import { BaseError } from "./baseError.js";

export class MongoValidationError extends BaseError {
  constructor(error: mongoose.Error.ValidationError) {
    super("Validation Error", 400, true, {
      errors: Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message
      }))
    });
  }
}

export class MongoCastError extends BaseError {
  constructor(error: mongoose.Error.CastError) {
    super("Invalid ID format", 422, true, {
      details: `The provided value '${error.value}' is not a valid MongoDB ObjectId.`
    });
  }
}

export class MongoDuplicateKeyError extends BaseError {
  constructor(error: mongoose.mongo.MongoServerError) {
    super("Duplicate key error", 409, true, {
      details: error.message
    });
  }
}
