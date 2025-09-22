import { AuthResult } from "express-oauth2-jwt-bearer";
import { ICity } from "../interfaces/index.js";
import { CityService } from "../services/index.js";
import { BaseController } from "./base.controller.js";

export class CityController extends BaseController<ICity, CityService> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(cityService: CityService, auth?: AuthResult) {
    super(cityService, auth);
  }
}
