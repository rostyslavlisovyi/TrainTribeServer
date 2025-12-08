import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import type { AuthResult } from "express-oauth2-jwt-bearer";
import NotificationModel from "../src/models/MongoDB/notification.model.js";
import UserModel from "../src/models/MongoDB/user.model.js";
import { NotificationService } from "../src/services/notification.service.js";
import { NotificationEnum } from "../src/types/enums.js";

jest.mock("../src/config/firebase.js", () => ({
  firebaseCloudMessaging: {
    send: jest.fn().mockResolvedValue(undefined)
  }
}));

import { firebaseCloudMessaging } from "../src/config/firebase.js";

describe("NotificationService", () => {
  let mongo: MongoMemoryServer;

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
    jest.clearAllMocks();
    await Promise.all([NotificationModel.deleteMany({}), UserModel.deleteMany({})]);
  });

  const buildUserService = (userOverrides: Record<string, unknown> = {}) => {
    return {
      get: jest.fn().mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        fcmToken: "token",
        fcmTokenUpdatedAt: new Date(),
        settings: {
          notifications: {
            [NotificationEnum.USER_JOIN_TRAINING]: true
          }
        },
        ...userOverrides
      })
    };
  };

  it("sends an FCM message when token is fresh and settings allow it", async () => {
    const userId = new mongoose.Types.ObjectId();
    const trainingId = new mongoose.Types.ObjectId();
    const userService = buildUserService({
      _id: userId
    });
    const service = new NotificationService(userService as never);

    await service.create({
      user: userId,
      triggeredBy: new mongoose.Types.ObjectId(),
      type: NotificationEnum.USER_JOIN_TRAINING,
      data: { trainingId }
    });

    expect(firebaseCloudMessaging.send).toHaveBeenCalledTimes(1);
    const payload = (firebaseCloudMessaging.send as jest.Mock).mock.calls[0][0];
    expect(payload.token).toBe("token");
    expect(payload.data.trainingId).toBe(trainingId.toString());
  });

  it("does not send when token is stale", async () => {
    const userId = new mongoose.Types.ObjectId();
    const userService = buildUserService({
      _id: userId,
      fcmTokenUpdatedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000)
    });
    const service = new NotificationService(userService as never);

    await service.create({
      user: userId,
      triggeredBy: new mongoose.Types.ObjectId(),
      type: NotificationEnum.USER_JOIN_TRAINING,
      data: {}
    });

    expect(firebaseCloudMessaging.send).not.toHaveBeenCalled();
  });

  describe("authenticated queries", () => {
    const buildAuthService = async () => {
      const authId = `auth-${new mongoose.Types.ObjectId().toString()}`;
      const user = await UserModel.create({ authId, email: `${authId}@test.com` });
      const auth = {
        payload: {
          user_id: authId
        }
      } as AuthResult;
      const userService = buildUserService({ _id: user._id });
      const service = new NotificationService(userService as never, auth);
      return { service, user };
    };

    it("counts unread notifications", async () => {
      const { service, user } = await buildAuthService();
      await NotificationModel.create([
        {
          user: user._id,
          triggeredBy: user._id,
          type: NotificationEnum.USER_JOIN_TRAINING,
          data: {},
          read: false
        },
        {
          user: user._id,
          triggeredBy: user._id,
          type: NotificationEnum.USER_JOIN_TRAINING,
          data: {},
          read: true
        }
      ]);

      const count = await service.countUnread();
      expect(count).toBe(1);
    });

    it("marks all notifications as read", async () => {
      const { service, user } = await buildAuthService();
      await NotificationModel.create([
        {
          user: user._id,
          triggeredBy: user._id,
          type: NotificationEnum.USER_JOIN_TRAINING,
          data: {},
          read: false
        },
        {
          user: user._id,
          triggeredBy: user._id,
          type: NotificationEnum.USER_JOIN_TRAINING,
          data: {},
          read: false
        }
      ]);

      const updated = await service.markAllAsRead();
      expect(updated).toBe(2);

      const unread = await NotificationModel.countDocuments({ user: user._id, read: false });
      expect(unread).toBe(0);
    });

    it("deletes all notifications for the user", async () => {
      const { service, user } = await buildAuthService();
      await NotificationModel.create([
        {
          user: user._id,
          triggeredBy: user._id,
          type: NotificationEnum.USER_JOIN_TRAINING,
          data: {}
        }
      ]);

      const deleted = await service.deleteAll();
      expect(deleted).toBe(1);
      expect(await NotificationModel.countDocuments({ user: user._id })).toBe(0);
    });

    it("detects notifications sent earlier today", async () => {
      const { service, user } = await buildAuthService();
      const trainingId = new mongoose.Types.ObjectId();

      await NotificationModel.create({
        user: user._id,
        triggeredBy: user._id,
        type: NotificationEnum.USER_JOIN_TRAINING,
        data: { trainingId },
        createdAt: new Date()
      });

      const received = await service.hasReceivedTrainingTypeToday(
        user._id,
        trainingId,
        NotificationEnum.USER_JOIN_TRAINING
      );
      expect(received).toBe(true);

      const otherTraining = new mongoose.Types.ObjectId();
      const none = await service.hasReceivedTrainingTypeToday(
        user._id,
        otherTraining,
        NotificationEnum.USER_JOIN_TRAINING
      );
      expect(none).toBe(false);
    });
  });
});
