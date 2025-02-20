import { CityService } from "./services/city.service.ts";

import { asClass, createContainer, InjectionMode } from "awilix";
import { CityController } from "./controllers/city.controller.ts";
import { UserService } from "./services/user.service.ts";
import { UserController } from "./controllers/user.controller.ts";

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
});

container
  .register({
    cityService: asClass(CityService),
    userService: asClass(UserService)
  })
  .register({
    cityController: asClass(CityController),
    userController: asClass(UserController)
  });

export default container;
