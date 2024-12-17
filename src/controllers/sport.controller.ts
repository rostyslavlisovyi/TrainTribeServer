import { Request, Response } from "express";
import { HydratedDocument } from "mongoose";

import { ISportMongoDB } from "../interfaces/sport.interfaces.js";
import SportsModel from "../models/MongoDB/sport.model.mongoDB.js";
import chalk from "chalk";
import handleError from "../utils/handleError.js";

export const GetSportById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sportsArray: HydratedDocument<ISportMongoDB>[] =
      await SportsModel.find();

    if (sportsArray.length === 0) {
      console.error(chalk.red("No sports found"));
      res.status(404).json({ message: "No sports found" });
      return;
    }

    res.json(sportsArray);
  } catch (error) {
    handleError(res, error);
  }
};
