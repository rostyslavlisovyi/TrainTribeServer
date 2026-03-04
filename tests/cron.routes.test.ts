import express, { Request } from "express";
import request from "supertest";
import { CronJobController } from "../src/controllers/cronJob.controller.js";
import type { RequestContext } from "../src/context/requestContext.js";
import cronJobRoute from "../src/routes/cronJob.routes.js";

const createApp = () => {
  const cityService = {
    inizialize: jest.fn()
  };
  const cronJobService = {
    createNotificationTrainingCompletionReminder: jest
      .fn()
      .mockResolvedValue(0),
    createNotificationTodayTrainingsReminder: jest.fn().mockResolvedValue(0),
    createNotificationRememberToCreateTraining: jest.fn().mockResolvedValue(0)
  };

  const controller = new CronJobController(
    cityService as never,
    cronJobService as never
  );

  const app = express();
  app.use((req, _res, next) => {
    (req as Request & { context: RequestContext }).context = {
      auth: undefined,
      services: {} as never,
      controllers: {
        cronJobController: () => controller
      }
    } as RequestContext;
    next();
  });
  app.use("/cron", cronJobRoute);

  return { app, cityService, cronJobService };
};

describe("Cron routes", () => {
  it("initializes cities", async () => {
    const { app, cityService } = createApp();

    const response = await request(app)
      .get("/cron/city-inizialize")
      .expect(200);

    expect(response.body).toEqual({ data: true });
    expect(cityService.inizialize).toHaveBeenCalledTimes(1);
  });

  it("triggers notification cron tasks", async () => {
    const { app, cronJobService } = createApp();

    const response = await request(app).get("/cron/notification").expect(200);

    expect(response.body).toEqual({ data: true });
    expect(
      cronJobService.createNotificationTrainingCompletionReminder
    ).toHaveBeenCalledTimes(1);
    expect(
      cronJobService.createNotificationTodayTrainingsReminder
    ).toHaveBeenCalledTimes(1);
    expect(
      cronJobService.createNotificationRememberToCreateTraining
    ).toHaveBeenCalledTimes(1);
  });
});
