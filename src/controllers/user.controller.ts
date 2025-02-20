import { Request, Response } from "express";
import { IUser } from "../interfaces/user.interfaces.js";
import handleError from "../utils/handleError.js";
import { BaseController } from "./base.controller.ts";
import { UserService } from "services/user.service.ts";

export class UserController extends BaseController<IUser> {
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
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
