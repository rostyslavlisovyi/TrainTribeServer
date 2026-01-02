import { AuthResult } from "express-oauth2-jwt-bearer";
import { IUser } from "../interfaces/index.js";
import { UserModel } from "../models/index.js";
import { BaseService } from "./base.service.js";

export class UserService extends BaseService<IUser> {
  constructor(auth?: AuthResult) {
    super(UserModel, auth);
  }

  protected override async ownershipFilter() {
    const authId = this.auth?.payload?.user_id ?? this.auth?.payload?.sub;
    if (!authId) {
      return {};
    }
    return { authId };
  }
}
