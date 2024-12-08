import express from "express";
import { Router } from "express";
import { GetSportById } from "../controllers/sport.controller.js";

const sportRoute: Router = express.Router({ mergeParams: true });

// GER: Get all sports
sportRoute.get("/", GetSportById);

export default sportRoute;
