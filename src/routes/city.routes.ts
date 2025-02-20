import { Router } from "express";
import { CityController } from "../controllers/city.controller.js";
import express from "express";
import container from "../container.ts";

const cityRoute: Router = express.Router();

const cityController = container.resolve<CityController>("cityController");

cityRoute.post("/", (req, res) => cityController.getAll(req, res));

cityRoute.get("/:id", (req, res) => cityController.get(req, res));

cityRoute.post("/", (req, res) => cityController.create(req, res));

cityRoute.put("/:id", (req, res) => cityController.update(req, res));

cityRoute.delete("/:id", (req, res) => cityController.delete(req, res));

export default cityRoute;
