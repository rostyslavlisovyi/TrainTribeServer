import express, {NextFunction, Request, Response} from "express";
import UserModel from "../models/user.js";
import {handleError} from "../utils/handleError.js";
import {type Model} from "sequelize";
import {IUser, IUserInput, IFrontUser} from "../interfaces";
import {nanoid} from "nanoid";
import {hashPassword} from "../utils/passwordUtils.js";

type UserInstance = Model<IUser, IUserInput>;

const usersRoutes = express.Router({mergeParams: true});

// @ts-ignore
usersRoutes.post("/", async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("post");
    const {username, email, password, location}: IFrontUser = req.body;
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
      console.log("User created");
      return res.status(201).json({message: "User created"});
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
usersRoutes.get("/", async (
  req: Request,
  res: Response,
  next: NextFunction) => {
  try {
    const users: UserInstance[] = await UserModel.findAll();
    const usersData: IUser[] = users.map((user: UserInstance) => user.get({plain: true}));
    console.log("users", users);
    return res.status(200).json(usersData);
  } catch (error) {
    handleError(error);
    next(error);
  }
});

// @ts-ignore
usersRoutes.delete("/:external_id", async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  try {
    const {external_id} = req.params;
    console.log(external_id, "external_id");
    const user: UserInstance | null = await UserModel.findOne({
        where: {
            external_id: external_id
        }
    });
    console.log('user', user);
    if (user) {
      await user.destroy();
      return res.status(200).json({message: "User deleted"});
    } else {
      return res.status(404).json({message: "User not found"});
    }
  } catch (error) {
    handleError(error);
    next(error);
  }
});

// @ts-ignore
usersRoutes.put("/:external_id", async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  try {
    const { external_id} = req.params;
    const {
        password,
        location,
        first_name,
        last_name,
    }: IUser = req.body;
    const user: UserInstance | null = await UserModel.findOne({
        where: {
            external_id: external_id
        }
    });
    if (user) {
      const hashedPassword: string = await hashPassword(password);
      await user.update({
        first_name: first_name,
        last_name: last_name,
        password: hashedPassword,
        location: location
      });
      return res.status(200).json({message: "User updated"});
    } else {
      return res.status(404).json({message: "User not found"});
    }
  } catch (error) {
    handleError(error);
    next(error);
  }
});


export default usersRoutes;

