import { Request, Response } from "express";
import CityModel from "../models/MongoDB/city.model.js";
import validationId from "../utils/validationObjectId.js";
import handleError from "../utils/handleError.js";

export const getCityById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { _id, ...rest } = req.query;
    if (Object.keys(rest).length > 0) {
      res.status(400).json({ message: "ONLY _id IS ALLOWED" });
      return;
    }
    if (!_id) {
      res.status(400).json({ message: "ID IS REQUIRED" });
      return;
    }
    if (!validationId(_id as string, res)) {
      return;
    }
    const existingCity = await CityModel.findById(_id);
    if (!existingCity) {
      res.status(404).json({ message: "CITY NOT FOUND" });
      return;
    }
    res.status(200).json({ city: existingCity });
    return;
  } catch (error) {
    handleError(res, error);
  }
};

export const getCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const cities = await CityModel.find();
    res.status(200).json({ cities });
    return;
  } catch (error) {
    handleError(res, error);
  }
};

export const getCityByNames = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, ...rest } = req.query;
    if (Object.keys(rest).length > 0) {
      res.status(400).json({ message: "ONLY name IS ALLOWED" });
      return;
    }
    if (!name) {
      res.status(400).json({ message: "NAME IS REQUIRED" });
      return;
    }
    const existingCity = await CityModel.findOne({ name });
    if (!existingCity) {
      res.status(404).json({ message: "CITY NOT FOUND" });
      return;
    }
    res.status(200).json({ city: existingCity });
    return;
  } catch (error) {
    handleError(res, error);
  }
};
