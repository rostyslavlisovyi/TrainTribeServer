import { Response } from "express";
import { NotFoundError } from "./notFoundError.js";
import { DataCannotBeEmpty } from "./dataCannotBeEmptyError.js";
import mongoose from "mongoose";
import chalk from "chalk";

export function handleError(res: Response, error: unknown) {
  console.error(chalk.red("Error:", error));
  if (error instanceof NotFoundError) {
    res.status(404).json({ message: error.message });
  } else if (error instanceof DataCannotBeEmpty) {
    res.status(400).json({ message: error.message });
  } else if (error instanceof mongoose.Error.CastError) {
    if (error.kind === "ObjectId") {
      res.status(422).json({
        message: "Invalid ID format",
        details: "The provided ID is not a valid MongoDB ObjectId"
      });
    } else {
      res.status(400).json({
        message: "Invalid data format",
        details: error.message
      });
    }
  } else if (error instanceof Error) {
    if (
      error.message.includes("network") ||
      error.message.includes("connection")
    ) {
      res.status(503).json({
        message: "Database connection error",
        details: error.message
      });
    } else {
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  } else if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      message: "Validation Error",
      errors: Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message
      }))
    });
  } else if (error instanceof mongoose.mongo.MongoServerError) {
    if (error.code === 11000) {
      res.status(409).json({
        message: "Duplicate key error",
        details: error.message
      });
    } else if (error.code === 50) {
      res.status(504).json({
        message: "Database operation timeout",
        details: error.message
      });
    } else {
      res.status(500).json({
        message: "Database error",
        details: error.message
      });
    }
  } else {
    res.status(500).json({ message: "An unknown error occurred" });
  }
}
