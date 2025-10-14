import { Document, ObjectId } from "mongoose";
import { NotificationEnum } from "types/enums.js";

interface BaseNotification extends Document<ObjectId> {
  user: ObjectId;
  triggeredBy: ObjectId;
  read?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type INotification =
  | (BaseNotification & {
      type: NotificationEnum.USER_JOIN_TRAINING;
      data: {
        user: string;
        userId: string;
        trainingTitle: string;
        trainingId: string;
      };
    })
  | (BaseNotification & {
      type: NotificationEnum.TRAINING_CREATED_NEAR_TO_USER;
      data: { trainingTitle: string; trainingId: string };
    })
  | (BaseNotification & {
      type: NotificationEnum.TRAINING_COMPLETION_REMINDER;
      data: { trainingTitle: string; trainingId: string };
    })
  | (BaseNotification & {
      type: NotificationEnum.REMEMBER_TO_LEAVE_REVIEW;
      data: {
        trainingTitle: string;
        trainingId: string;
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
        trainingId: string;
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
        trainingId: string;
      };
    })
  | (BaseNotification & {
      type: NotificationEnum.TRAINING_EDITED;
      data: {
        trainingTitle: string;
        trainingId: string;
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
        trainingId: string;
      };
    })
  | (BaseNotification & {
      type: NotificationEnum.NEW_REVIEW_ON_TRAINING;
      data: {
        trainingTitle: string;
        trainingId: string;
      };
    });
