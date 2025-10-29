import { AuthResult } from "express-oauth2-jwt-bearer";
import { TokenMessage } from "firebase-admin/messaging";
import { ObjectId } from "mongoose";
import { firebaseCloudMessaging } from "../config/firebase.js";
import { INotification } from "../interfaces/index.js";
import { NotificationModel } from "../models/index.js";
import { NotificationEnum } from "../types/enums.js";
import { BaseService } from "./base.service.js";
import { UserService } from "./user.service.js";

export class NotificationService extends BaseService<INotification> {
  private readonly userService: UserService;

  constructor(userService: UserService, auth?: AuthResult) {
    super(NotificationModel, auth);
    this.userService = userService;
  }

  protected async baseFilter() {
    const user = await this.getAuthUser();
    return { user: user._id };
  }

  override async create(
    entity: Partial<INotification>
  ): Promise<INotification> {
    const result = await super.create(entity);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = await this.userService.get({ id: entity.user!.toString() });

    if (
      user?.fcmToken &&
      user?.fcmTokenUpdatedAt &&
      user?.settings?.notifications[result.type]
    ) {
      const tokenUpdatedAt = user.fcmTokenUpdatedAt;
      const maxAgeDays = 90;
      const isTokenFresh =
        Date.now() - tokenUpdatedAt.getTime() <
        maxAgeDays * 24 * 60 * 60 * 1000;
      if (isTokenFresh) {
        try {
          const message: TokenMessage = {
            token: user.fcmToken,
            data: {
              type: result.type,
              ...(result.data ?? {})
            },
            webpush: {
              headers: {
                Urgency: "high"
              }
            }
          };
          await firebaseCloudMessaging.send(message);
        } catch (error) {
          // Log the error but do not fail the notification creation
          console.error("Errore nell'invio della notifica FCM:", error);
        }
      }
    }

    return result;
  }

  async countUnread() {
    const user = await this.getAuthUser();
    const count = await this.model.countDocuments({
      user: user._id,
      read: false
    });

    return count;
  }

  async markAllAsRead() {
    const user = await this.getAuthUser();

    const result = await this.model.updateMany(
      { user: user._id, read: false },
      { $set: { read: true } }
    );

    return result.modifiedCount;
  }

  async hasReceivedTrainingTypeToday(
    userId: ObjectId,
    trainingId: ObjectId,
    type: NotificationEnum
  ): Promise<boolean> {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const tomorrow = new Date(startOfDay);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await this.model.countDocuments({
      user: userId,
      type: type,
      data: {
        trainingId
      },
      createdAt: { $gte: startOfDay, $lt: tomorrow }
    });

    return count > 0;
  }
}
