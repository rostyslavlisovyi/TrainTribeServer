/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Model, ObjectId, Query, Schema } from "mongoose";
import {
  DaysOfTheWeekEnum,
  LanguageEnum,
  NotificationEnum,
  SportsEnum,
  TimeSlotsEnum,
  TrainingFrequencyEnum,
  TrainingGoalEnum,
  TrainingLevelEnum
} from "../../types/enums.js";

import {
  BADGE_REVIEW_THRESHOLDS,
  BADGE_TRAINING_THRESHOLDS
} from "../../config/app.config.js";
import { IUser } from "../../interfaces/index.js";
import { NotificationService, UserService } from "../../services/index.js";

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    athleteBio: { type: String, required: false },
    authId: { type: String, required: true, unique: true },
    city: { type: Schema.Types.ObjectId, ref: "City", required: false },
    dateOfBirth: { type: Date, required: false },
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    hasCompletedOnboarding: { type: Boolean, required: false },
    image: { type: Schema.Types.Mixed, required: false },
    lastName: { type: String },
    lastOnboardingStep: { type: String, required: false },
    privacySettings: { type: Boolean, default: false },
    rangeOfAction: { type: Number },
    sports: [
      {
        type: String,
        enum: Object.values(SportsEnum)
      }
    ],
    trainingGoal: [
      {
        type: String,
        enum: Object.values(TrainingGoalEnum)
      }
    ],
    trainingLevel: {
      type: String,
      enum: Object.values(TrainingLevelEnum)
    },
    trainingFrequency: {
      type: String,
      enum: Object.values(TrainingFrequencyEnum)
    },
    trainingPartnerPreference: { type: String },
    trainingTimeSlot: [
      {
        day: {
          type: String,
          enum: Object.values(DaysOfTheWeekEnum)
        },
        startTime: {
          type: String,
          enum: Object.values(TimeSlotsEnum)
        },
        endTime: {
          type: String,
          enum: Object.values(TimeSlotsEnum)
        }
      }
    ],
    trainingPoints: { type: Number, default: 0 },
    reviewPoints: { type: Number, default: 0 },
    countTrainingOrganized: { type: Number, default: 0 },
    countTrainingJoined: { type: Number, default: 0 },
    countTrainingMissed: { type: Number, default: 0 },
    language: {
      type: String,
      enum: Object.values(LanguageEnum),
      default: LanguageEnum.IT
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    fcmToken: {
      type: String
    },
    fcmTokenUpdatedAt: {
      type: Date
    },
    settings: {
      notifications: Object.fromEntries(
        Object.values(NotificationEnum).map((key) => [
          key,
          { type: Boolean, default: true }
        ])
      )
    }
  },
  {
    timestamps: true
  }
);

interface OldUserData {
  trainingPoints: number;
  reviewPoints: number;
}

interface OldUserDataWithId extends OldUserData {
  id: string;
}

interface IUserDocument extends IUser {
  _wasNew?: boolean;
  _oldTrainingPoints?: number;
  _oldReviewPoints?: number;
  _oldData?: OldUserData;
  _oldDataArray?: OldUserDataWithId[];
}

interface UserQuery {
  _id?: ObjectId | string;
  [key: string]: any;
}

interface PreSaveContext extends IUserDocument {
  _wasNew?: boolean;
  _oldTrainingPoints?: number;
  _oldReviewPoints?: number;
}

interface PreUpdateContext {
  _oldData?: OldUserData;
  _oldDataArray?: OldUserDataWithId[];
  model: Model<IUserDocument>;
  getQuery(): UserQuery;
}

type PostUpdateContext = PreUpdateContext;

function calculateLevel(
  points: number,
  thresholds: Record<number, number>
): number {
  const sortedThresholds = Object.values(thresholds).sort((a, b) => a - b);

  for (let i = 0; i < sortedThresholds.length; i++) {
    if (points < sortedThresholds[i]) {
      return i + 1;
    }
  }

  return sortedThresholds.length + 1;
}

async function checkBadgeUpdate(
  userId: ObjectId,
  oldTrainingPoints: number,
  newTrainingPoints: number,
  oldReviewPoints: number,
  newReviewPoints: number
): Promise<void> {
  // Training
  const oldTrainingLevel = calculateLevel(
    oldTrainingPoints,
    BADGE_TRAINING_THRESHOLDS
  );
  const newTrainingLevel = calculateLevel(
    newTrainingPoints,
    BADGE_TRAINING_THRESHOLDS
  );

  if (newTrainingLevel > oldTrainingLevel) {
    const notificationService = new NotificationService(new UserService());
    await notificationService.create({
      user: userId,
      triggeredBy: userId,
      type: NotificationEnum.NEW_BADGE,
      data: {
        badge: "training"
      }
    });
  }

  // Review
  const oldReviewLevel = calculateLevel(
    oldReviewPoints,
    BADGE_REVIEW_THRESHOLDS
  );
  const newReviewLevel = calculateLevel(
    newReviewPoints,
    BADGE_REVIEW_THRESHOLDS
  );
  if (newReviewLevel > oldReviewLevel) {
    const notificationService = new NotificationService(new UserService());
    await notificationService.create({
      user: userId,
      triggeredBy: userId,
      type: NotificationEnum.NEW_BADGE,
      data: {
        badge: "review"
      }
    });
  }
}

// Hook per save - salva i valori precedenti prima del save
UserSchema.pre<IUserDocument>("save", function (this: PreSaveContext) {
  if (!this.isNew) {
    this._wasNew = false;
    this._oldTrainingPoints = this.get("trainingPoints");
    this._oldReviewPoints = this.get("reviewPoints");
  } else {
    this._wasNew = true;
  }
});

UserSchema.post<IUserDocument>("save", async function (doc: IUserDocument) {
  const self = this as PreSaveContext;
  if (!self._wasNew) {
    await checkBadgeUpdate(
      doc._id,
      self._oldTrainingPoints || 0,
      doc.trainingPoints || 0,
      self._oldReviewPoints || 0,
      doc.reviewPoints || 0
    );
  }
});

UserSchema.pre<Query<IUserDocument, IUserDocument>>(
  "findOneAndUpdate",
  async function (this: PreUpdateContext) {
    try {
      const query = this.getQuery() as UserQuery;
      const doc = await this.model.findOne(query);
      if (doc) {
        this._oldData = {
          trainingPoints: doc.trainingPoints || 0,
          reviewPoints: doc.reviewPoints || 0
        };
      }
    } catch (err) {
      console.error("Errore nel recuperare dati precedenti:", err);
    }
  }
);
UserSchema.post<Query<IUserDocument, IUserDocument>>(
  "findOneAndUpdate",
  async function (this: PostUpdateContext, doc: IUserDocument | null) {
    if (doc && this._oldData) {
      await checkBadgeUpdate(
        doc._id,
        this._oldData.trainingPoints,
        doc.trainingPoints || 0,
        this._oldData.reviewPoints,
        doc.reviewPoints || 0
      );
    }
  }
);

UserSchema.pre<Query<any, IUserDocument>>(
  /^update/,
  async function (this: PreUpdateContext) {
    try {
      const Model = this.model as mongoose.Model<IUserDocument>;
      const query = this.getQuery() as UserQuery;
      const docs = await Model.find(query).select(
        "_id trainingPoints reviewPoints"
      );
      if (docs.length > 0) {
        this._oldDataArray = docs.map((doc) => ({
          id: doc._id.toString(),
          trainingPoints: doc.trainingPoints || 0,
          reviewPoints: doc.reviewPoints || 0
        }));
      }
    } catch (err) {
      console.error("Errore nel recuperare dati precedenti per update:", err);
    }
  }
);

UserSchema.post<Query<any, IUserDocument>>(
  /^update/,
  async function (this: PostUpdateContext) {
    if (!this._oldDataArray || this._oldDataArray.length === 0) return;

    try {
      const Model = this.model as mongoose.Model<IUserDocument>;
      const query = this.getQuery() as UserQuery;
      const updatedDocs = await Model.find(query).select(
        "_id trainingPoints reviewPoints"
      );

      for (const updatedDoc of updatedDocs) {
        const oldData = this._oldDataArray.find(
          (old: OldUserDataWithId) => old.id === updatedDoc._id.toString()
        );
        if (oldData) {
          await checkBadgeUpdate(
            updatedDoc._id,
            oldData.trainingPoints,
            updatedDoc.trainingPoints || 0,
            oldData.reviewPoints,
            updatedDoc.reviewPoints || 0
          );
        }
      }
    } catch (err) {
      console.error("Errore nel controllo badge dopo update:", err);
    }
  }
);

const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>(
  "User",
  UserSchema
);

export default UserModel;
