import { scopePerRequest } from "awilix-express";
import express from "express";
import type { AuthResult } from "express-oauth2-jwt-bearer";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import container from "../src/container.js";
import { authContainerMiddleware } from "../src/middlewares/index.js";
import NotificationModel from "../src/models/MongoDB/notification.model.js";
import UserModel from "../src/models/MongoDB/user.model.js";
import notificationRoute from "../src/routes/notification.route.js";
import { NotificationEnum } from "../src/types/enums.js";

let mongo: MongoMemoryServer;
const currentAuthId = "notification-auth";

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
app.use("/notification", notificationRoute);

const uniqueEmail = (prefix: string) =>
  `${prefix}-${new mongoose.Types.ObjectId().toString()}@test.com`;

async function seedUserWithNotifications() {
  const user = await UserModel.create({
    authId: currentAuthId,
    email: uniqueEmail("auth")
  });

  const trigger = await UserModel.create({
    authId: "trigger",
    email: uniqueEmail("trigger")
  });

  const otherUser = await UserModel.create({
    authId: "another-user",
    email: uniqueEmail("other")
  });

  await NotificationModel.create([
    {
      user: user._id,
      triggeredBy: trigger._id,
      type: NotificationEnum.USER_JOIN_TRAINING,
      data: { trainingId: new mongoose.Types.ObjectId() },
      read: false
    },
    {
      user: user._id,
      triggeredBy: trigger._id,
      type: NotificationEnum.REMEMBER_TO_LEAVE_REVIEW,
      data: { trainingId: new mongoose.Types.ObjectId() },
      read: true
    },
    {
      user: otherUser._id,
      triggeredBy: trigger._id,
      type: NotificationEnum.NEW_BADGE,
      data: {},
      read: false
    }
  ]);

  return { user };
}

describe("Notification routes", () => {
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
      NotificationModel.deleteMany({}),
      UserModel.deleteMany({})
    ]);
  });

  it("lists notifications for the authenticated user", async () => {
    const { user } = await seedUserWithNotifications();

    const response = await request(app)
      .post("/notification/list")
      .send({ pageNum: 1, pageSize: 10 })
      .expect(200);

    expect(Array.isArray(response.body?.data)).toBe(true);
    expect(response.body.totalItems).toBe(2);
    const userIds = response.body.data.map(
      (item: { user: string }) => item.user
    );
    expect(userIds.every((id: string) => id === user._id.toString())).toBe(
      true
    );
  });

  it("returns the count of unread notifications", async () => {
    await seedUserWithNotifications();

    const response = await request(app)
      .get("/notification/count-unread")
      .expect(200);

    expect(response.body.data).toBe(1);
  });

  it("marks all notifications as read", async () => {
    const { user } = await seedUserWithNotifications();

    const response = await request(app)
      .put("/notification/mark-all-as-read")
      .expect(200);

    expect(response.body.data).toBe(1);

    const unread = await NotificationModel.countDocuments({
      user: user._id,
      read: false
    });
    expect(unread).toBe(0);
  });

  it("deletes all notifications for the user", async () => {
    const { user } = await seedUserWithNotifications();

    const response = await request(app)
      .delete("/notification/delete-all")
      .expect(200);

    expect(response.body.data).toBe(2);

    const remaining = await NotificationModel.countDocuments({
      user: user._id
    });
    expect(remaining).toBe(0);
  });
});
