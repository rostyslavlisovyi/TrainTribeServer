import mongoose from "mongoose";
import { Response } from "express";
const validationId = (id: string, res: Response) => {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "INVALID ID FORMAT" });
    return false;
  }
  return true;
};

export default validationId;
