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

  async getByAuthId(req: Request, res: Response): Promise<void> {
    try {
      const { auth_id } = req.params;
      const { populate } = req.query;

      const query = this.service.model.findOne({ auth_id });
      if (populate) {
        query.populate(populate as string | string[]);
      }
      const result = await query;
      if (!result) {
        res.status(404).json({ message: "Not Found" });
        return;
      }
      res.json(result);
    } catch (error) {
      handleError(res, error);
    }
  }
}
