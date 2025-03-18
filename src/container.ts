import { asClass, createContainer, InjectionMode } from "awilix";

import { TrainingService, UserService, CityService } from "./services/index.js";
import {
  TrainingController,
  UserController,
  CityController
} from "./controllers/index.js";

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
});

container
  .register({
    cityService: asClass(CityService),
    userService: asClass(UserService),
    trainingService: asClass(TrainingService)
  })
  .register({
    cityController: asClass(CityController),
    userController: asClass(UserController),
    trainingController: asClass(TrainingController)
  });

export default container;
