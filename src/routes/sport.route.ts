const express = require("express");
const SportsModel = require("../models/MongoDB/sport.model.mongoDB");

import { Request, Response, Router} from "express";
import { HydratedDocument } from "mongoose";
import { ISportMongoDB } from "../interfaces/sport.interfaces";

const sportRoute: Router = express.Router({ mergeParams: true });

sportRoute.get("/", async (req: Request, res: Response): Promise<void> => {
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
});

module.exports = sportRoute;
