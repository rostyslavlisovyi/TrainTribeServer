import { asClass, createContainer, InjectionMode } from "awilix";

import {
  CityController,
  CloudinaryController,
  TrainingController,
  UserController
} from "./controllers/index.js";
import {
  CityService,
  CloudinaryService,
  TrainingService,
  UserService
} from "./services/index.js";

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
});

container
  .register({
    cityService: asClass(CityService),
    userService: asClass(UserService),
    trainingService: asClass(TrainingService),
    cloudinaryService: asClass(CloudinaryService)
  })
  .register({
    cityController: asClass(CityController),
    userController: asClass(UserController),
    trainingController: asClass(TrainingController),
    cloudinaryController: asClass(CloudinaryController)
  });

export default container;
