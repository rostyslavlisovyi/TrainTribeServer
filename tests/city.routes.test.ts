import express from "express";
import request from "supertest";
import { scopePerRequest } from "awilix-express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import type { AuthResult } from "express-oauth2-jwt-bearer";
import container from "../src/container.js";
import cityRoute from "../src/routes/city.routes.js";
import { authContainerMiddleware } from "../src/middlewares/index.js";
import CityModel from "../src/models/MongoDB/city.model.js";

let mongo: MongoMemoryServer;
let currentAuthId = "city-auth";

const app = express();
app.use(express.json());
app.use(scopePerRequest(container));
app.use((req, _res, next) => {
  req.auth = {
    payload: {
      user_id: currentAuthId
    }
  } as AuthResult;
  next();
});
app.use(authContainerMiddleware);
app.use("/city", cityRoute);

const baseLocation = { type: "Point", coordinates: [12.4924, 41.8902] } as const;

async function createCity(
  overrides: Partial<{
    istatCode: string;
    name: string;
    province: string;
    region: string;
  }> = {}
) {
  const payload = {
    istatCode: overrides.istatCode ?? new mongoose.Types.ObjectId().toString(),
    name: overrides.name ?? "Test City",
    province: overrides.province ?? "RM",
    region: overrides.region ?? "Lazio",
    location: baseLocation
  };

  return await CityModel.create(payload);
}

describe("City routes", () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  });

  afterEach(async () => {
    await CityModel.deleteMany({});
  });

  it("creates a city", async () => {
    const payload = {
      istatCode: "001",
      name: "Roma",
      province: "RM",
      region: "Lazio",
      location: baseLocation
    };

    const response = await request(app).post("/city").send(payload).expect(201);

    expect(response.body.data.name).toBe("Roma");
    expect(await CityModel.countDocuments({ istatCode: "001" })).toBe(1);
  });

  it("lists cities with pagination payload", async () => {
    await createCity({ name: "Milano" });

    const response = await request(app)
      .post("/city/list")
      .send({ pageNum: 1, pageSize: 10 })
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.totalItems).toBe(1);
  });

  it("fetches a city by id", async () => {
    const city = await createCity({ name: "Torino" });

    const response = await request(app)
      .get(`/city/${city._id.toString()}`)
      .expect(200);

    expect(response.body.data.name).toBe("Torino");
  });

  it("updates a city", async () => {
    const city = await createCity({ name: "Bologna" });

    const response = await request(app)
      .put(`/city/${city._id.toString()}`)
      .send({ name: "Bologna Centro" })
      .expect(200);

    expect(response.body.data.name).toBe("Bologna Centro");
  });

  it("deletes a city", async () => {
    const city = await createCity();

    await request(app).delete(`/city/${city._id.toString()}`).expect(204);

    expect(await CityModel.countDocuments({ _id: city._id })).toBe(0);
  });
});
