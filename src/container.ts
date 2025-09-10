import { asClass, createContainer, InjectionMode } from "awilix";

import {
  CityController,
  CloudinaryController,
  GeocodeController,
  TrainingController,
  UserController,
  ReviewController
} from "./controllers/index.js";
import {
  CityService,
  CloudinaryService,
  GeocodeService,
  TrainingService,
  UserService,
  ReviewService
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
    geocodeService: asClass(GeocodeService),
    reviewService: asClass(ReviewService)
  })
  .register({
    cityController: asClass(CityController),
    userController: asClass(UserController),
    trainingController: asClass(TrainingController),
    cloudinaryController: asClass(CloudinaryController),
    geocodeController: asClass(GeocodeController),
    reviewController: asClass(ReviewController)
  });

export default container;
