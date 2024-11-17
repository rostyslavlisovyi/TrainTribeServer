import express, { NextFunction, Request, Response } from "express";
import TrainingModel from "../models/training.js";
import { handleError } from "../utils/handleError.js";
import { Model } from "sequelize";
import { ITraining } from "../interfaces/training.interfaces.js";

type TrainingInstance = Model<ITraining>;

const trainingRoutes = express.Router({ mergeParams: true });

// @ts-ignore
trainingRoutes.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trainings: TrainingInstance[] = await TrainingModel.findAll();
      const trainingsData: ITraining[] = trainings.map((training) =>
        training.get({ plain: true })
      );
      console.log("trainings", trainings);
      return res.status(200).json(trainingsData);
    } catch (error) {
      handleError(error);
      next(error);
    }
  }
);

export default trainingRoutes;
