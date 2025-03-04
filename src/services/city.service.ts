import { ICity } from "../interfaces/index.js";
import CityModel from "../models/MongoDB/city.model.ts";
import { BaseService } from "./base.service.ts";

export class CityService extends BaseService<ICity> {
  now = Date.now();
  constructor() {
    super(CityModel);
  }
}
