import { asClass, createContainer, InjectionMode } from "awilix";

import {
  CityController,
  CloudinaryController,
  CronJobController,
  GeocodeController,
  NotificationController,
  ReviewController,
  TrainingController,
  UserController
} from "./controllers/index.js";
import {
  CityService,
  CloudinaryService,
  CronJobService,
  GeocodeService,
  NotificationService,
  ReviewService,
  TrainingService,
  UserService
} from "./services/index.js";

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
});

container
  .register({
    cityService: asClass(CityService).scoped(),
    userService: asClass(UserService).scoped(),
    trainingService: asClass(TrainingService).scoped(),
    cloudinaryService: asClass(CloudinaryService).scoped(),
    geocodeService: asClass(GeocodeService).scoped(),
    reviewService: asClass(ReviewService).scoped(),
    notificationService: asClass(NotificationService).scoped(),
    cronJobService: asClass(CronJobService).scoped()
  })
  .register({
    cityController: asClass(CityController).scoped(),
    userController: asClass(UserController).scoped(),
    trainingController: asClass(TrainingController).scoped(),
    cloudinaryController: asClass(CloudinaryController).scoped(),
    geocodeController: asClass(GeocodeController).scoped(),
    reviewController: asClass(ReviewController).scoped(),
    notificationController: asClass(NotificationController).scoped(),
    cronJobController: asClass(CronJobController).scoped()
  });

export default container;
