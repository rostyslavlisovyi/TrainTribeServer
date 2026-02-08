import express from "express";
import type { AuthResult } from "express-oauth2-jwt-bearer";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { requestContextMiddleware } from "../src/middlewares/index.js";
import ReviewModel from "../src/models/MongoDB/review.model.js";
import TrainingModel from "../src/models/MongoDB/training.model.js";
import UserModel from "../src/models/MongoDB/user.model.js";
import reviewRoutes from "../src/routes/review.routes.js";
import { TrainingStatusEnum } from "../src/types/index.js";

let mongo: MongoMemoryServer;
let currentAuthId = "reviewer-auth";

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
app.use("/review", reviewRoutes);

const reviewTrainingAddress = () => ({
  city: "Rome",
  country: "Italy"
});

describe("Review routes", () => {
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
    await Promise.all([
      UserModel.deleteMany({}),
      TrainingModel.deleteMany({}),
      ReviewModel.deleteMany({})
    ]);
    currentAuthId = "reviewer-auth";
  });

  async function seedTraining() {
    const reviewer = await UserModel.create({
      authId: "reviewer-auth",
      email: "reviewer@test.com"
    });
    const creator = await UserModel.create({
      authId: "creator-auth",
      email: "creator@test.com"
    });

    const training = await TrainingModel.create({
      title: "Training",
      creator: creator._id,
      status: TrainingStatusEnum.COMPLETED,
      sport: "RUNNING",
      date: new Date(),
      address: reviewTrainingAddress(),
      location: { type: "Point", coordinates: [12, 50] },
      participants: [
        {
          participant: reviewer._id,
          attended: true
        }
      ]
    });

    return { reviewer, creator, training };
  }

  it("creates a review", async () => {
    const { reviewer, creator, training } = await seedTraining();

    const response = await request(app)
      .post("/review")
      .send({
        training: training._id.toString(),
        reviewedUser: creator._id.toString(),
        stars: 4,
        comment: "Great session"
      })
      .expect(200);

    expect(response.body?.data?.comment).toBe("Great session");
    const review = await ReviewModel.findOne({ reviewer: reviewer._id });
    expect(review).not.toBeNull();
  });

  it("validates rating range", async () => {
    const { creator, training } = await seedTraining();

    await request(app)
      .post("/review")
      .send({
        training: training._id.toString(),
        reviewedUser: creator._id.toString(),
        stars: 8,
        comment: "Too high"
      })
      .expect(400);

    const count = await ReviewModel.countDocuments();
    expect(count).toBe(0);
  });

  it("prevents updating review by another user", async () => {
    const { reviewer, creator, training } = await seedTraining();
    const created = await ReviewModel.create({
      training: training._id,
      reviewedUser: creator._id,
      reviewer: reviewer._id,
      stars: 5,
      comment: "Initial"
    });

    await UserModel.create({
      authId: "other-auth",
      email: "other@test.com"
    });
    currentAuthId = "other-auth";

    await request(app)
      .put(`/review/${created._id.toString()}`)
      .send({ stars: 3 })
      .expect(403);
  });
});
