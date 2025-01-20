import mongoose from "mongoose";
import { Response } from "express";
const validationId = (id: string, res: Response): boolean => {
  if (!mongoose.isValidObjectId(id)) {
    res.status(422).json({
      message: "UNPROCESSABLE ENTITY",
      errors: [{ message: "INVALID _id FORMAT" }]
    });
    return false;
  }
  return true;
};

export default validationId;
