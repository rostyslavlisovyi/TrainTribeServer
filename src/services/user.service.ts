import { IUser } from "../interfaces/user.interfaces.ts";
import UserModel from "../models/MongoDB/user.model.ts";
import { BaseService } from "./base.service.ts";

export class UserService extends BaseService<IUser> {
  constructor() {
    super(UserModel);
  }
}
