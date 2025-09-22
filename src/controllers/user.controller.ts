import { Request, Response } from "express";
import { AuthResult } from "express-oauth2-jwt-bearer";
import { IUser } from "../interfaces/index.js";
import { BaseResponse } from "../models/index.js";
import { UserService } from "../services/index.js";
import { handleError } from "../utils/index.js";
import { BaseController } from "./base.controller.js";

export class UserController extends BaseController<IUser, UserService> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(userService: UserService, auth?: AuthResult) {
    super(userService, auth);
  }

  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.getAuthUser(
        req.query.populate as string | string[]
      );
      res.status(200).json(new BaseResponse(user));
    } catch (error) {
      handleError(res, error);
    }
  }
}
