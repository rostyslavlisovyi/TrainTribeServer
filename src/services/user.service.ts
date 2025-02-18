import { IUser } from "../interfaces/user.interface.ts";
import UserModel from "../models/MongoDB/user.model.ts";
import { BaseService } from "./base.service.ts";

export class UserService extends BaseService<IUser> {
  constructor() {
    super(UserModel);
  }
}
