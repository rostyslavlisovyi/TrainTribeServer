import { ICity } from "../interfaces/city.interface.ts";
import { CityService } from "../services/city.service.ts";
import { BaseController } from "./base.controller.ts";

export class CityController extends BaseController<ICity> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(cityService: CityService) {
    super(cityService);
  }
}
