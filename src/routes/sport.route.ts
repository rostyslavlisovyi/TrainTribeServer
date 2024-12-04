import express, { Request, Response, Router } from "express";
import SportsModel from "../models/MongoDB/sport.model.mongoDB.js";
import { HydratedDocument } from "mongoose";

import { ISportMongoDB } from "../interfaces/sport.interfaces";
import { authenticate } from "middlewares/auth.middleware.js";

const sportRoute: Router = express.Router({ mergeParams: true });

sportRoute.get(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const sportsArray: HydratedDocument<ISportMongoDB>[] =
        await SportsModel.find();

      if (sportsArray.length === 0) {
        console.log("No sports found");
        res.status(404).json({ message: "No sports found" });
        return;
      }

      res.json(sportsArray);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default sportRoute;
