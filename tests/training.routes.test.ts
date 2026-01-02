import express from "express";
import request from "supertest";
import { scopePerRequest } from "awilix-express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import type { AuthResult } from "express-oauth2-jwt-bearer";
import container from "../src/container.js";
import trainingRoutes from "../src/routes/training.routes.js";
import { authContainerMiddleware } from "../src/middlewares/index.js";
import UserModel from "../src/models/MongoDB/user.model.js";
import TrainingModel from "../src/models/MongoDB/training.model.js";
import NotificationModel from "../src/models/MongoDB/notification.model.js";
import CommentModel from "../src/models/MongoDB/comment.model.js";
import UserLeaderboardModel from "../src/models/MongoDB/userLeaderboard.model.js";
import {
  NotificationEnum,
  SportsEnum,
  TrainingLevelEnum,
  TrainingStatusEnum
} from "../src/types/enums.js";

let mongo: MongoMemoryServer;
let currentAuthId = "training-auth";

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
app.use("/training", trainingRoutes);

const futureDate = () => new Date(Date.now() + 60 * 60 * 1000);
const baseLocation = { type: "Point", coordinates: [12.4839, 41.8947] } as const;

const uniqueEmail = () =>
  `training-${new mongoose.Types.ObjectId().toString()}@test.com`;

async function createUser(
  overrides: Partial<{
    authId: string;
    sports: SportsEnum[];
    trainingLevel: TrainingLevelEnum;
  }> = {}
) {
  const data = {
    authId: overrides.authId ?? `auth-${new mongoose.Types.ObjectId().toString()}`,
    email: uniqueEmail(),
    sports: overrides.sports ?? [SportsEnum.RUNNING],
    trainingLevel: overrides.trainingLevel ?? TrainingLevelEnum.BEGINNER
  };

  return await UserModel.create({ ...data, firstName: "Tester" });
}

async function createTraining(overrides: Partial<{ creator: mongoose.Types.ObjectId } & Record<string, unknown>> = {}) {
  const creator = overrides.creator ?? (await createUser())._id;

  return await TrainingModel.create({
    title: "Morning Run",
    description: "Easy pace",
    date: futureDate(),
    address: "Central Park",
    location: baseLocation,
    sport: SportsEnum.RUNNING,
    difficultyLevel: TrainingLevelEnum.BEGINNER,
    duration: 45,
    creator,
    ...overrides
  });
}

describe("Training routes", () => {
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
    currentAuthId = "training-auth";
  });

  afterEach(async () => {
    await Promise.all([
      TrainingModel.deleteMany({}),
      UserModel.deleteMany({}),
      NotificationModel.deleteMany({}),
      CommentModel.deleteMany({}),
      UserLeaderboardModel.deleteMany({})
    ]);
  });

  it("creates a training", async () => {
    const creator = await createUser({ authId: "creator-auth" });

    const payload = {
      title: "Tempo Session",
      description: "Threshold workout",
      date: futureDate().toISOString(),
      address: "Test track",
      location: baseLocation,
      sport: SportsEnum.RUNNING,
      creator: creator._id.toString(),
      difficultyLevel: TrainingLevelEnum.INTERMEDIATE,
      duration: 60
    };

    const response = await request(app)
      .post("/training")
      .send(payload)
      .expect(201);

    expect(response.body.data.title).toBe("Tempo Session");
    expect(await TrainingModel.countDocuments({ title: "Tempo Session" })).toBe(1);
  });

  it("lists trainings with pagination", async () => {
    await createTraining();

    const response = await request(app)
      .post("/training/list")
      .send({ pageNum: 1, pageSize: 5 })
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.totalItems).toBe(1);
  });

  it("fetches a training by id", async () => {
    const training = await createTraining();

    const response = await request(app)
      .get(`/training/${training._id.toString()}`)
      .expect(200);

    expect(response.body.data._id).toBe(training._id.toString());
  });

  it("allows an authenticated user to like and unlike a training", async () => {
    const training = await createTraining();
    const liker = await createUser({ authId: "like-auth" });
    currentAuthId = liker.authId;

    const likeResponse = await request(app)
      .post(`/training/${training._id.toString()}/like`)
      .expect(200);

    expect(likeResponse.body.data.likes).toContain(liker._id.toString());

    const unlikeResponse = await request(app)
      .delete(`/training/${training._id.toString()}/like`)
      .expect(200);

    expect(unlikeResponse.body.data.likes).not.toContain(liker._id.toString());
  });

  it("lets a user join and leave as a participant", async () => {
    const training = await createTraining();
    const participant = await createUser({ authId: "participant-auth" });
    currentAuthId = participant.authId;

    const joinResponse = await request(app)
      .post(`/training/${training._id.toString()}/participants`)
      .expect(200);

    expect(joinResponse.body.data.participants).toHaveLength(1);

    const leaveResponse = await request(app)
      .delete(`/training/${training._id.toString()}/participants`)
      .expect(200);

    expect(leaveResponse.body.data.participants).toHaveLength(0);
  });

  it("allows the creator to complete a training and notifies participants", async () => {
    const creator = await createUser({ authId: "creator-complete" });
    const participant = await createUser();

    const training = await createTraining({
      creator: creator._id,
      participants: [
        {
          participant: participant._id,
          attended: true,
          hasLeftReview: false
        }
      ]
    });

    currentAuthId = creator.authId;

    const response = await request(app)
      .patch(`/training/${training._id.toString()}/status`)
      .send({ status: TrainingStatusEnum.COMPLETED })
      .expect(200);

    expect(response.body.data.status).toBe(TrainingStatusEnum.COMPLETED);

    const notificationCount = await NotificationModel.countDocuments({
      user: participant._id,
      type: NotificationEnum.REMEMBER_TO_LEAVE_REVIEW
    });
    expect(notificationCount).toBe(1);
  });
});
