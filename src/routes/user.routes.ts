import { Router } from "express";
import {
  GetUserById,
  CreateUser,
  UpdateUser,
  DeleteUser
} from "../controllers/user.controller.js";
import express from "express";
import authenticate from "../middlewares/auth.middleware.js";

const userRoute: Router = express.Router();

// GET: Get user by ID
userRoute.get("/", authenticate, GetUserById);

// POST: Create new user
userRoute.post("/", authenticate, CreateUser);

// PUT: Update user by ID
userRoute.put("/", authenticate, UpdateUser);

// DELETE: Delete user by ID
userRoute.delete("/", authenticate, DeleteUser);

export default userRoute;
