import mongoose, { Document } from "mongoose";
import { NotificationEnum } from "types/enums.js";

interface BaseNotification extends Document<mongoose.Types.ObjectId> {
  user: mongoose.Types.ObjectId;
  triggeredBy: mongoose.Types.ObjectId;
  read?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type INotification =
  | (BaseNotification & {
      type: NotificationEnum.USER_JOIN_TRAINING;
      data: {
        user: string;
        userId: mongoose.Types.ObjectId;
        trainingTitle: string;
        trainingId: mongoose.Types.ObjectId;
      };
    })
  | (BaseNotification & {
      type: NotificationEnum.TRAINING_CREATED_NEAR_TO_USER;
      data: { trainingTitle: string; trainingId: mongoose.Types.ObjectId };
    })
  | (BaseNotification & {
      type: NotificationEnum.TRAINING_COMPLETION_REMINDER;
      data: { trainingTitle: string; trainingId: mongoose.Types.ObjectId };
    })
  | (BaseNotification & {
      type: NotificationEnum.REMEMBER_TO_LEAVE_REVIEW;
      data: {
        trainingTitle: string;
        trainingId: mongoose.Types.ObjectId;
        trainingCreator: string;
      };
    })
  | (BaseNotification & {
      type: NotificationEnum.NEW_BADGE;
      data: { badge: "review" | "training" };
    })
  | (BaseNotification & {
      type: NotificationEnum.NEW_REVIEW_ON_TRAINING;
      data: {
        trainingTitle: string;
        trainingId: mongoose.Types.ObjectId;
        comment: string;
        user: string;
      };
    })
  | (BaseNotification & {
      type: NotificationEnum.NEW_COMMENT_ON_TRAINING;
      data: {
        user: string;
        comment: string;
        trainingTitle: string;
        trainingId: mongoose.Types.ObjectId;
      };
    })
  | (BaseNotification & {
      type: NotificationEnum.REPLY_COMMENT_ON_TRAINING;
      data: {
        user: string;
        comment: string;
        trainingTitle: string;
        trainingId: mongoose.Types.ObjectId;
      };
    })
  | (BaseNotification & {
      type: NotificationEnum.TRAINING_EDITED;
      data: {
        trainingTitle: string;
        trainingId: mongoose.Types.ObjectId;
      };
    })
  | (BaseNotification & {
      type: NotificationEnum.TRANING_DELETED;
      data: {
        trainingTitle: string;
      };
    })
  | (BaseNotification & {
      type: NotificationEnum.TODAY_TRAININGS_REMINDER;
      data: {
        trainingTitle: string;
        trainingId: mongoose.Types.ObjectId;
      };
    })
  | (BaseNotification & {
      type: NotificationEnum.NEW_REVIEW_ON_TRAINING;
      data: {
        trainingTitle: string;
        trainingId: mongoose.Types.ObjectId;
      };
    })
  | (BaseNotification & {
      type: NotificationEnum.REMEMBER_TO_CREATE_TRAINING;
      data: Record<string, never>;
    });
