import express, {Request, Response}  from "express";
import {Training} from "../models/training.js";



const trainingRoutes = express.Router({mergeParams: true});


trainingRoutes.get("/", async (req:Request, res:Response) => {});

export default trainingRoutes;
