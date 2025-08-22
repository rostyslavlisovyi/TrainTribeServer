import { asClass, createContainer, InjectionMode } from "awilix";

import {
  CityController,
  CloudinaryController,
  GeocodeController,
  TrainingController,
  UserController
} from "./controllers/index.js";
import {
  CityService,
  CloudinaryService,
  GeocodeService,
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
    cloudinaryService: asClass(CloudinaryService),
    geocodeService: asClass(GeocodeService)
  })
  .register({
    cityController: asClass(CityController),
    userController: asClass(UserController),
    trainingController: asClass(TrainingController),
    cloudinaryController: asClass(CloudinaryController),
    geocodeController: asClass(GeocodeController)
  });

export default container;
