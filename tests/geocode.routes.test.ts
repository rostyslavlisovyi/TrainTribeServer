import type { AwilixContainer } from "awilix";
import express from "express";
import request from "supertest";
import { GeocodeController } from "../src/controllers/geocode.controller.js";
import geocodeRoutes from "../src/routes/geocode.routes.js";

const createApp = () => {
  const geocodeService = {
    geocode: jest.fn().mockResolvedValue([{ display_name: "Roma" }]),
    reverse: jest.fn().mockResolvedValue({ display_name: "Colosseo" })
  };

  const controller = new GeocodeController(geocodeService as never);

  const container = {
    resolve: () => controller
  } as unknown as AwilixContainer;

  const app = express();
  app.use((req, _res, next) => {
    (req as any).container = container;
    next();
  });
  app.use("/geocode", geocodeRoutes);

  return { app, geocodeService };
};

describe("Geocode routes", () => {
  it("searches for addresses", async () => {
    const { app, geocodeService } = createApp();

    const response = await request(app)
      .get("/geocode/search")
      .query({ search: "Roma" })
      .expect(200);

    expect(geocodeService.geocode).toHaveBeenCalledWith("Roma", "it");
    expect(response.body.data[0].display_name).toBe("Roma");
  });

  it("validates missing search query", async () => {
    const { app, geocodeService } = createApp();

    const response = await request(app).get("/geocode/search").expect(400);

    expect(response.body.message).toBe("search parameter is required");
    expect(geocodeService.geocode).not.toHaveBeenCalled();
  });

  it("reverses coordinates with Accept-Language header", async () => {
    const { app, geocodeService } = createApp();

    const response = await request(app)
      .get("/geocode/reverse")
      .set("Accept-Language", "en-US,en;q=0.8")
      .query({ lat: "41.9", lon: "12.5" })
      .expect(200);

    expect(geocodeService.reverse).toHaveBeenCalledWith(
      "41.9",
      "12.5",
      "en-US"
    );
    expect(response.body.data.display_name).toBe("Colosseo");
  });

  it("requires both lat and lon for reverse geocoding", async () => {
    const { app, geocodeService } = createApp();

    const response = await request(app)
      .get("/geocode/reverse")
      .query({ lat: "41.9" })
      .expect(400);

    expect(response.body.message).toBe(
      "Latitude and longitude parameters are required"
    );
    expect(geocodeService.reverse).not.toHaveBeenCalled();
  });
});
