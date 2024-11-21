import express, {Router, Request, Response} from "express";
import {authenticate} from "../middlewares/auth.middleware.js";
import UserModel from "../models/MongoDB/user.model.mongoDB.js";

const userRoute: Router = express.Router();

userRoute.get("/", authenticate, async (req:Request, res:Response):Promise<void> => {
  try {
    if (typeof req.user === "object" && req.user !== null && "id" in req.user) {
      const userId: string = req.user.id as string;
      console.log("userId", userId);
      const existingUser = await UserModel.findById(userId);
        if (!existingUser) {
            res.status(404).json({message: "USER NOT FOUND"});
            return;
        }
          res.status(200).json({user: existingUser});
          return;
    } else {
        res.status(401).json({message: "UNAUTHORIZED"});
        return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "INTERNAL SERVER ERROR"});
  }
});

userRoute.put("/", authenticate, async (req:Request, res:Response):Promise<void> => {
  try {
    if (typeof req.user === "object" && req.user !== null && "id" in req.user) {
      const userId: string = req.user.id as string;
      console.log("userId", userId);

      const updates = Object.keys(req.body).reduce((acc, key) => {
        acc[key] = req.body[key];
        return acc;
      }, {} as Record<string, any>);

      if (Object.keys(updates).length === 0) {
        res.status(400).json({message: "NO FIELDS PROVIDED FOR UPDATEN"});
        return;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(userId, updates,
          {
            new: true,
            runValidators: true,
          }
      );
      if (!updatedUser) {
        res.status(404).json({message: "USER NOT FOUND"});
        return;
      }
      res.status(200).json({user: updatedUser});
      return;
    } else {
      res.status(401).json({message: "UNAUTHORIZED"});
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "INTERNAL SERVER ERROR"});
  }
});

userRoute.delete("/", authenticate, async (req:Request, res:Response):Promise<void> => {
  try {
    if (typeof req.user === "object" && req.user !== null && "id" in req.user) {
      const userId: string = req.user.id as string;
      console.log("userId", userId);
      const deletedUser = await UserModel.findByIdAndDelete(userId);
      if (!deletedUser) {
        res.status(404).json({message: "USER NOT FOUND"});
        return;
      }
      res.status(200).json({message: "USER DELETED"});
      return;
    } else {
      res.status(401).json({message: "UNAUTHORIZED"});
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "INTERNAL SERVER ERROR"});
  }
});
export default userRoute;
