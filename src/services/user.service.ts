import { IUser } from "../interfaces/index.js";
import UserModel from "../models/MongoDB/user.model.js";
import { BaseService } from "./base.service.ts";

export class UserService extends BaseService<IUser> {
  constructor() {
    super(UserModel);
  }
}
