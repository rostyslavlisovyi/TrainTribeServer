import { AuthResult } from "express-oauth2-jwt-bearer";
import {
  CityController,
  CloudinaryController,
  CronJobController,
  FeedbackController,
  GeocodeController,
  LeaderboardController,
  NotificationController,
  ReviewController,
  TrainingController,
  UserController
} from "../controllers/index.js";
import {
  CityService,
  CloudinaryService,
  CronJobService,
  FeedbackService,
  GeocodeService,
  LeaderboardService,
  NotificationService,
  ReviewService,
  TrainingService,
  UserService
} from "../services/index.js";

export interface ServiceRegistry {
  cityService: () => CityService;
  userService: () => UserService;
  trainingService: () => TrainingService;
  cloudinaryService: () => CloudinaryService;
  geocodeService: () => GeocodeService;
  reviewService: () => ReviewService;
  notificationService: () => NotificationService;
  cronJobService: () => CronJobService;
  leaderboardService: () => LeaderboardService;
  feedbackService: () => FeedbackService;
}

export interface ControllerRegistry {
  cityController: () => CityController;
  userController: () => UserController;
  trainingController: () => TrainingController;
  cloudinaryController: () => CloudinaryController;
  geocodeController: () => GeocodeController;
  reviewController: () => ReviewController;
  notificationController: () => NotificationController;
  cronJobController: () => CronJobController;
  leaderboardController: () => LeaderboardController;
  feedbackController: () => FeedbackController;
}

export interface RequestContext {
  auth?: AuthResult;
  services: ServiceRegistry;
  controllers: ControllerRegistry;
}

export function buildRequestContext(auth?: AuthResult): RequestContext {
  const services: ServiceRegistry = {
    cityService: () => new CityService(auth),
    userService: () => new UserService(auth),
    trainingService: () => new TrainingService(auth),
    cloudinaryService: () => new CloudinaryService(),
    geocodeService: () => new GeocodeService(),
    reviewService: () => new ReviewService(auth),
    feedbackService: () => new FeedbackService(auth),
    notificationService: () =>
      new NotificationService(services.userService(), auth),
    cronJobService: () => new CronJobService(services.notificationService()),
    leaderboardService: () => new LeaderboardService()
  };

  const controllers: ControllerRegistry = {
    cityController: () => new CityController(services.cityService(), auth),
    userController: () => new UserController(services.userService(), auth),
    trainingController: () =>
      new TrainingController(
        services.trainingService(),
        services.notificationService(),
        auth
      ),
    cloudinaryController: () =>
      new CloudinaryController(services.cloudinaryService()),
    geocodeController: () => new GeocodeController(services.geocodeService()),
    reviewController: () =>
      new ReviewController(
        services.reviewService(),
        services.notificationService(),
        services.trainingService(),
        auth
      ),
    notificationController: () =>
      new NotificationController(services.notificationService(), auth),
    cronJobController: () =>
      new CronJobController(services.cityService(), services.cronJobService()),
    leaderboardController: () =>
      new LeaderboardController(services.leaderboardService()),
    feedbackController: () =>
      new FeedbackController(services.feedbackService(), auth)
  };

  return {
    auth,
    services,
    controllers
  };
}
