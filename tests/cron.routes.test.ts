import express from "express";
import request from "supertest";
import type { AwilixContainer } from "awilix";
import { CronJobController } from "../src/controllers/cronJob.controller.js";
import cronJobRoute from "../src/routes/cronJob.routes.js";

const createApp = () => {
  const cityService = {
    inizialize: jest.fn()
  };
  const cronJobService = {
    createNotificationTrainingCompletionReminder: jest.fn().mockResolvedValue(0),
    createNotificationTodayTrainingsReminder: jest.fn().mockResolvedValue(0)
  };

  const controller = new CronJobController(
    cityService as never,
    cronJobService as never
  );

  const container = {
    resolve: () => controller
  } as unknown as AwilixContainer;

  const app = express();
  app.use((req, _res, next) => {
    (req as any).container = container;
    next();
  });
  app.use("/cron", cronJobRoute);

  return { app, cityService, cronJobService };
};

describe("Cron routes", () => {
  it("initializes cities", async () => {
    const { app, cityService } = createApp();

    const response = await request(app).get("/cron/city-inizialize").expect(200);

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
  });
});
