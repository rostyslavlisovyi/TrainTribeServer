import { Request, Response } from "express";
import { IUser } from "../interfaces/index.js";
import { handleError } from "../utils/index.js";
import { BaseController } from "./base.controller.js";
import { UserService } from "../services/user.service.js";

export class UserController extends BaseController<IUser, UserService> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(userService: UserService) {
    super(userService);
  }

  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.getUserFromToken(req);
      res.json(user);
    } catch (error) {
      handleError(res, error);
    }
  }
}
