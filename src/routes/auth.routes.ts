import express, { Request, Response, Router } from "express";
import UserModel from "../models/MongoDB/user.model.mongoDB.js";

import { IUser } from "../interfaces/user.interfaces";

import { hashPassword, verifyPassword } from "../utils/passwordUtils.js";
import { HydratedDocument } from "mongoose";
import { generateToken } from "../utils/jwt.utils.js";

const authRoute: Router = express.Router({ mergeParams: true });

authRoute.post(
  "/signup",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const existingUser: HydratedDocument<IUser> | null =
        await UserModel.findOne().where("email").equals(email);

      if (existingUser) {
        res.status(409).json({ message: "User already exists" });
        return;
      }
      const hashedPassword: string = await hashPassword(password);
      const newUser = new UserModel({
        email,
        password_hashed: hashedPassword,
        username: "",
        first_name: "",
        last_name: "",
        image_url: "",
        latitude: 0,
        longitude: 0
      });
      const savedUser: IUser = await newUser.save();
      const token: string = generateToken({ id: savedUser._id });
      res.status(201).json({
        user: savedUser,
        token
      });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

authRoute.post(
  "/signin",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const existingUser: HydratedDocument<IUser> | null =
        await UserModel.findOne().where("email").equals(email);

      if (!existingUser) {
        res.status(404).json({ message: "USER DOES NOT EXIST" });
        return;
      }

      const isPasswordCorrect: boolean = await verifyPassword(
        password,
        existingUser.password_hashed
      );

      if (!isPasswordCorrect) {
        res.status(401).json({ message: "INVALID CREDENTIALS" });
        return;
      }
      const token: string = generateToken({ id: existingUser._id });
      res.status(200).json({
        user: existingUser,
        token
      });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
);

export default authRoute;
