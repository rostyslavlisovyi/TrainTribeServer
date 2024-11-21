import express, { Request, Response, Router } from "express";
import UserModel from "../models/MongoDB/user.model.mongoDB.js";

import { IUser } from "../interfaces/user.interfaces";

import { hashPassword, verifyPassword } from "../utils/password.utils.js";
import { HydratedDocument } from "mongoose";
import { generateToken } from "../utils/jwt.utils.js";

const authRoute: Router = express.Router({ mergeParams: true });

authRoute.post(
  "/signUp",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "EMAIL & PASSWORD ARE REQUIRED" });
        return;
      }

      const existingUser: HydratedDocument<IUser> | null =
        await UserModel.findOne().where("email").equals(email);

      if (existingUser) {
        res.status(409).json({ message: "USER ALREADY EXIST" });
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
      res.status(500).json({ message: "INTERNAL SERVER ERROR", error });
    }
  }
);

authRoute.post(
  "/signIn",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "EMAIL & PASSWORD ARE REQUIRED" });
        return;
      }

      const existingUser: HydratedDocument<IUser> | null =
        await UserModel.findOne().where("email").equals(email);

      if (!existingUser) {
        res.status(404).json({ message: "INVALID CREDENTIALS" });
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
      res.status(500).json({ message: "INTERNAL SERVER ERROR", error });
      return;
    }
  }
);

export default authRoute;
