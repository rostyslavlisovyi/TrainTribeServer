const express = require("express");
const UserModel = require("../models/MongoDB/user.model.mongoDB");
const mongoose = require("mongoose");
const authenticate = require("../middlewares/auth.middleware");

import { Router, Request, Response } from "express";
import { IUser } from "../interfaces/user.interfaces";
import { HydratedDocument } from "mongoose";

const userRoute: Router = express.Router();

// Helper function to validate MongoDB ObjectId
const validationId = (id: string, res: Response): boolean => {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "INVALID ID FORMAT" });
    return false;
  }
  return true;
};

// Centralized error handler
const handleError = (
  res: Response,
  error: unknown,
  message = "INTERNAL SERVER ERROR"
): void => {
  console.error(error);
  res.status(500).json({ message });
};
// GET: Retrieve user by ID
userRoute.get(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { _id } = req.body;
      if (!validationId(_id, res)) {
        return;
      }

      const existingUser = await UserModel.findById(_id);
      if (!existingUser) {
        res.status(404).json({ message: "USER NOT FOUND" });
        return;
      }
      res.status(200).json({ user: existingUser });
      return;
    } catch (error) {
      handleError(res, error);
    }
  }
);
// POST: Create new user
userRoute.post(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        email,
        username,
        first_name,
        last_name,
        image_url,
        latitude,
        longitude,
        sport
      } = req.body as IUser;
      if (!email) {
        res.status(400).json({ message: "EMAIL IS REQUIRED" });
        return;
      }
      const existingUser: HydratedDocument<IUser> | null =
        await UserModel.findOne().where("email").equals(email);
      if (existingUser) {
        res
          .status(409)
          .json({ message: "USER WITH THIS EMAIL ALREADY EXISTS" });
        return;
      }
      const newUser: IUser = new UserModel({
        email: email,
        username: username || "",
        first_name: first_name || "",
        last_name: last_name || "",
        image_url: image_url || "",
        latitude: latitude || 0,
        longitude: longitude || 0,
        sport: sport || []
      });
      const savedUser: IUser = await newUser.save();
      res.status(201).json({ user: savedUser });
    } catch (error) {
      handleError(res, error);
    }
  }
);
// PUT: Update user by ID
userRoute.put(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { _id } = req.body;
      if (!validationId(_id, res)) {
        return;
      }

      const updates = Object.keys(req.body).reduce(
        (acc, key) => {
          acc[key] = req.body[key];
          return acc;
        },
        {} as Record<string, any>
      );

      if (Object.keys(updates).length === 0) {
        res.status(400).json({ message: "NO FIELDS PROVIDED FOR UPDATE" });
        return;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(_id, updates, {
        new: true,
        runValidators: true
      });
      if (!updatedUser) {
        res.status(404).json({ message: "USER NOT FOUND" });
        return;
      }
      res.status(200).json({ user: updatedUser });
      return;
    } catch (error) {
      handleError(res, error);
    }
  }
);

// DELETE: Delete user by ID
userRoute.delete(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { _id } = req.body;
      if (!validationId(_id, res)) {
        return;
      }
      const deletedUser = await UserModel.findByIdAndDelete(_id);
      if (!deletedUser) {
        res.status(404).json({ message: "USER NOT FOUND" });
        return;
      }
      res.status(200).json({ message: "USER DELETED" });
      return;
    } catch (error) {
      handleError(res, error);
    }
  }
);

module.exports = userRoute;
