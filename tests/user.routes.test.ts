import express from "express";
import type { AuthResult } from "express-oauth2-jwt-bearer";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { requestContextMiddleware } from "../src/middlewares/index.js";
import UserModel from "../src/models/MongoDB/user.model.js";
import userRoute from "../src/routes/user.routes.js";

let mongo: MongoMemoryServer;
let currentAuthId = "user-auth";

const app = express();
app.use(express.json());
app.use((req, _res, next) => {
  req.auth = {
    payload: {
      user_id: currentAuthId
    }
  } as AuthResult;
  next();
});
app.use(requestContextMiddleware);
app.use("/user", userRoute);

const uniqueEmail = () =>
  `user-${new mongoose.Types.ObjectId().toString()}@test.com`;

async function createUser(
  overrides: Partial<{ authId: string; email: string; firstName: string }> = {}
) {
  const baseUser = {
    authId: `auth-${new mongoose.Types.ObjectId().toString()}`,
    email: uniqueEmail(),
    firstName: "Tester"
  };

  return await UserModel.create({ ...baseUser, ...overrides });
}

describe("User routes", () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  });

  beforeEach(() => {
    currentAuthId = "user-auth";
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  it("returns the authenticated user from /user/me", async () => {
    currentAuthId = "auth-me";
    const user = await createUser({ authId: currentAuthId, firstName: "John" });

    const response = await request(app).get("/user/me").expect(200);

    expect(response.body.data._id).toEqual(user._id.toString());
    expect(response.body.data.firstName).toBe("John");
  });

  it("fetches a user by id", async () => {
    const user = await createUser({ firstName: "Fetch" });

    const response = await request(app)
      .get(`/user/${user._id.toString()}`)
      .expect(200);

    expect(response.body.data._id).toBe(user._id.toString());
    expect(response.body.data.firstName).toBe("Fetch");
  });

  it("returns 404 when user is missing", async () => {
    const missingId = new mongoose.Types.ObjectId().toString();

    const response = await request(app).get(`/user/${missingId}`).expect(404);

    expect(response.body.message).toBe("Not Found");
  });

  it("creates a new user", async () => {
    const payload = {
      authId: "new-auth",
      email: uniqueEmail(),
      firstName: "Alice"
    };

    const response = await request(app).post("/user").send(payload).expect(201);

    expect(response.body.data.email).toBe(payload.email);
    expect(await UserModel.countDocuments({ authId: payload.authId })).toBe(1);
  });

  it("validates required fields on user creation", async () => {
    const response = await request(app)
      .post("/user")
      .send({ authId: "missing-email" })
      .expect(422);

    expect(response.body.message).toBe("INVALID INPUTS TYPE");
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  it("updates an existing user", async () => {
    const user = await createUser({ authId: currentAuthId, firstName: "Old" });

    const response = await request(app)
      .put(`/user/${user._id.toString()}`)
      .send({ firstName: "Updated" })
      .expect(200);

    expect(response.body.data.firstName).toBe("Updated");

    const refreshed = await UserModel.findById(user._id);
    expect(refreshed?.firstName).toBe("Updated");
  });

  it("validates update payload", async () => {
    const user = await createUser();

    const response = await request(app)
      .put(`/user/${user._id.toString()}`)
      .send({ city: "invalid-city-id" })
      .expect(422);

    expect(response.body.message).toBe("INVALID INPUTS TYPE");
  });

  it("returns 404 when updating a missing user", async () => {
    const missingId = new mongoose.Types.ObjectId().toString();

    const response = await request(app)
      .put(`/user/${missingId}`)
      .send({ firstName: "Nobody" })
      .expect(404);

    expect(response.body.message).toContain("Data with id");
  });
});
