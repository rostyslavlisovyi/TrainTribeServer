import express, {NextFunction, Request, Response} from "express";
import {handleError} from "../utils/handleError.js";
import {type Model} from "sequelize";

import UserModel from "../models/user.js";

import {nanoid} from "nanoid";
import {verifyPassword, hashPassword} from "../utils/passwordUtils.js";
import jwt from "jsonwebtoken";
import {ILoginUser, IUser, IUserInput,IRegisterUser} from "../interfaces/user.interfaces";

type UserInstance = Model<IUser, IUserInput>;

const authRoutes = express.Router({mergeParams: true});

// @ts-ignore
authRoutes.post("/signUp", async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("post");
    const {username, email, password, location}: IRegisterUser = req.body;
    const existingUser: UserInstance | null = await UserModel.findOne({
      where: {
        email: email
      }
    });
    const hashedPassword: string = await hashPassword(password);
    if (!existingUser) {
      console.log("create user");
      const newUser: IUserInput = {
        external_id: nanoid(12),
        username: username,
        first_name: "",
        last_name: "",
        email: email,
        password: hashedPassword,
        location: location
      };
      await UserModel.create<UserInstance>(newUser);
      const token: string = jwt.sign(
        {
          email: email
        },
        process.env.JWT_SECRET ?? "",
        {
          expiresIn: "1h"
        }
      );
      console.log("User created");
      return res.status(201).json({token: token, user: newUser});
    } else {
      console.log("User already exists");
      return res.status(409).json({message: "User already exists"});
    }
  } catch (error) {
    handleError(error);
    next(error);
  }
});

// @ts-ignore
authRoutes.post("/signIn", async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    console.log("post");
    const {email, password}: ILoginUser = req.body;
    const user: UserInstance | null = await UserModel.findOne({
      where: {
        email: email
      }
    });
    if (!user) {
      return res.status(401).json({message: "User not found"});
    }
    const userPassword: string = user.getDataValue("password");
    console.log("userPassword", userPassword);
    console.log("password", password);
    const passwordMatch: boolean = await verifyPassword(password, userPassword);
    if (!passwordMatch) {
      return res.status(401).json({message: "Invalid password"});
    }
    const token: string = jwt.sign(
      {
        id: user.getDataValue("id"),
        email: user.getDataValue("email")
      },
      process.env.JWT_SECRET ?? "",
      {
        expiresIn: "1h"
      }
    );
    return res.status(200).json({token: token});
  } catch (error) {
    handleError(error);
    next(error);
  }
});

export default authRoutes;
