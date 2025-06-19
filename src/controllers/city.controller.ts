import { ICity } from "../interfaces/index.js";
import { CityService } from "../services/index.js";
import { BaseController } from "./base.controller.js";

export class CityController extends BaseController<ICity, CityService> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(cityService: CityService) {
    super(cityService);
  }
}
