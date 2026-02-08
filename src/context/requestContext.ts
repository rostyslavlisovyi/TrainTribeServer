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
  cityService: CityService;
  userService: UserService;
  trainingService: TrainingService;
  cloudinaryService: CloudinaryService;
  geocodeService: GeocodeService;
  reviewService: ReviewService;
  notificationService: NotificationService;
  cronJobService: CronJobService;
  leaderboardService: LeaderboardService;
  feedbackService: FeedbackService;
}

export interface ControllerRegistry {
  cityController: CityController;
  userController: UserController;
  trainingController: TrainingController;
  cloudinaryController: CloudinaryController;
  geocodeController: GeocodeController;
  reviewController: ReviewController;
  notificationController: NotificationController;
  cronJobController: CronJobController;
  leaderboardController: LeaderboardController;
  feedbackController: FeedbackController;
}

export interface RequestContext {
  auth?: AuthResult;
  services: ServiceRegistry;
  controllers: ControllerRegistry;
}

export function buildRequestContext(auth?: AuthResult): RequestContext {
  const cityService = new CityService(auth);
  const userService = new UserService(auth);
  const trainingService = new TrainingService(auth);
  const cloudinaryService = new CloudinaryService();
  const geocodeService = new GeocodeService();
  const reviewService = new ReviewService(auth);
  const feedbackService = new FeedbackService(auth);
  const notificationService = new NotificationService(userService, auth);
  const cronJobService = new CronJobService(notificationService);
  const leaderboardService = new LeaderboardService();

  const services: ServiceRegistry = {
    cityService,
    userService,
    trainingService,
    cloudinaryService,
    geocodeService,
    reviewService,
    notificationService,
    cronJobService,
    leaderboardService,
    feedbackService
  };

  const controllers: ControllerRegistry = {
    cityController: new CityController(cityService, auth),
    userController: new UserController(userService, auth),
    trainingController: new TrainingController(
      trainingService,
      notificationService,
      auth
    ),
    cloudinaryController: new CloudinaryController(cloudinaryService),
    geocodeController: new GeocodeController(geocodeService),
    reviewController: new ReviewController(
      reviewService,
      notificationService,
      trainingService,
      auth
    ),
    notificationController: new NotificationController(
      notificationService,
      auth
    ),
    cronJobController: new CronJobController(cityService, cronJobService),
    leaderboardController: new LeaderboardController(leaderboardService),
    feedbackController: new FeedbackController(feedbackService, auth)
  };

  return {
    auth,
    services,
    controllers
  };
}
