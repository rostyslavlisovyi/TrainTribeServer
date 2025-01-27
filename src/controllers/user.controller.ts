import { Request, Response } from "express";
import { HydratedDocument } from "mongoose";

import { IUser } from "../interfaces/user.interfaces.js";
import UserModel from "../models/MongoDB/user.model.mongoDB.js";
import validationId from "../utils/validationObjectId.js";
import handleError from "../utils/handleError.js";

export const GetUserById = async (
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
};

export const GetUserByAuthId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { auth_id, ...rest } = req.query;
    if (Object.keys(rest).length > 0) {
      res.status(400).json({ message: "ONLY auth_id IS ALLOWED" });
      return;
    }
    if (!auth_id) {
      res.status(400).json({ message: "auth_id IS REQUIRED" });
      return;
    }

    const existingUser = await UserModel.findOne({ auth_id });
    if (!existingUser) {
      res.status(404).json({ message: "USER NOT FOUND" });
      return;
    }
    res.status(200).json({ user: existingUser });
    return;
  } catch (error) {
    handleError(res, error);
  }
};

export const CreateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allowedFields = [
      "email",
      "username",
      "first_name",
      "last_name",
      "image_url",
      "latitude",
      "longitude",
      "sport",
      "completed_trainings",
      "social_number",
      "athlete_bio",
      "auth_id",
      "last_onbording_step",
      "has_completed_onboarding",
      "privacy_settings"
    ];
    const extraFields: string[] = Object.keys(req.body).filter(
      (key: string) => !allowedFields.includes(key)
    );
    if (extraFields.length > 0) {
      res.status(400).json({
        message: `ONLY ALLOWED FIELDS ARE ACCEPTED: ${allowedFields.join(", ")}`
      });
      return;
    }
    const {
      email,
      username,
      first_name,
      last_name,
      image_url,
      latitude,
      longitude,
      sport,
      completed_trainings,
      social_number,
      athlete_bio,
      auth_id,
      last_onbording_step,
      has_completed_onboarding,
      privacy_settings
    } = req.body as IUser;
    if (!email) {
      res.status(400).json({ message: "EMAIL IS REQUIRED" });
      return;
    }
    const existingUser: HydratedDocument<IUser> | null =
      await UserModel.findOne().where("email").equals(email);
    if (existingUser) {
      res.status(409).json({ message: "USER WITH THIS EMAIL ALREADY EXISTS" });
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
      sport: sport || [],
      completed_trainings: completed_trainings || 0,
      social_number: social_number || "",
      athlete_bio: athlete_bio || "",
      auth_id: auth_id || "",
      last_onbording_step: last_onbording_step || "",
      has_complyted_onboarding: has_completed_onboarding || false,
      privacy_settings: privacy_settings || false
    });
    const savedUser: IUser = await newUser.save();
    res.status(201).json({ user: savedUser });
  } catch (error) {
    handleError(res, error);
  }
};

export const UpdateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { _id } = req.body;
    if (!_id) {
      res.status(400).json({ message: "ID IS REQUIRED" });
      return;
    }
    if (!validationId(_id, res)) {
      return;
    }
    const updates = Object.keys(req.body).reduce(
      (acc, key) => {
        acc[key] = req.body[key];
        return acc;
      },
      {} as Record<string, unknown>
    );

    if (Object.keys(updates).length <= 1) {
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
};

export const DeleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { _id, ...rest } = req.body;
    if (Object.keys(rest).length > 0) {
      res.status(400).json({ message: "ONLY _id IS ALLOWED" });
      return;
    }
    if (!_id) {
      res.status(400).json({ message: "ID IS REQUIRED" });
      return;
    }
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
};
