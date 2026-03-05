import { AuthResult } from "express-oauth2-jwt-bearer";
import mongoose from "mongoose";
import { CONSTANTS } from "../config/app.config.js";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError
} from "../errors/index.js";
import { ITraining, ITrainingParticipant, IUser } from "../interfaces/index.js";
import { CityModel } from "../models/index.js";
import CommentModel from "../models/MongoDB/comment.model.js";
import TrainingModel from "../models/MongoDB/training.model.js";
import UserModel from "../models/MongoDB/user.model.js";
import UserLeaderboardModel from "../models/MongoDB/userLeaderboard.model.js";
import { TrainingStatusEnum } from "../types/index.js";
import { BaseService } from "./base.service.js";

export class TrainingService extends BaseService<ITraining> {
  constructor(auth?: AuthResult) {
    super(TrainingModel, auth);
  }

  protected override async ownershipFilter() {
    if (!this.auth) {
      return {};
    }
    const user = await this.getAuthUser();
    return { creator: user._id };
  }

  override async create(entity: Partial<ITraining>): Promise<ITraining> {
    const newTraining = await super.create(entity);
    if (newTraining && newTraining.creator) {
      await UserModel.findByIdAndUpdate(newTraining.creator, {
        $inc: { countTrainingOrganized: 1 }
      });
    }

    return newTraining;
  }

  async createWithRecurrence(
    payload: Partial<ITraining> & {
      recurrence?: {
        frequency?: "daily" | "weekly" | "monthly";
        interval?: number;
        daysOfWeek?: number[];
        dayOfMonth?: number;
        endDate?: Date | string;
      };
      isRecurring?: boolean;
    }
  ): Promise<{ master: ITraining; occurrences: ITraining[] } | { master: ITraining; occurrences: [] }> {
    if (!payload.isRecurring || !payload.recurrence) {
      const master = await this.create(payload);
      return { master, occurrences: [] };
    }

    const baseDate = payload.date ? new Date(payload.date) : null;
    if (!baseDate || Number.isNaN(baseDate.getTime())) {
      throw new BadRequestError("A valid start date is required for recurring trainings");
    }

    const {
      daysOfWeek,
      endDate,
      frequency = "weekly",
      interval = 1,
      dayOfMonth
    } = payload.recurrence;

    if (!endDate) {
      throw new BadRequestError("Recurrence end date is required");
    }

    const normalizedEndDate = new Date(endDate);
    if (Number.isNaN(normalizedEndDate.getTime())) {
      throw new BadRequestError("Recurrence end date must be valid");
    }

    if (normalizedEndDate.getTime() <= baseDate.getTime()) {
      throw new BadRequestError("Recurrence end date must be after the start date");
    }

    const diffDays = Math.ceil(
      (normalizedEndDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const MAX_RANGE_DAYS = 180;
    if (diffDays > MAX_RANGE_DAYS) {
      throw new BadRequestError("Recurrence cannot span more than 180 days");
    }

    const recurrenceId = new mongoose.Types.ObjectId().toString();
    const normalizedInterval = interval > 0 ? interval : 1;

    let normalizedDays: number[] | undefined = daysOfWeek
      ? Array.from(new Set(daysOfWeek))
      : undefined;
    if (frequency === "weekly") {
      if (!normalizedDays || normalizedDays.length === 0) {
        normalizedDays = [baseDate.getDay()];
      }
    } else {
      normalizedDays = undefined;
    }

    const sanitizedDayOfMonth =
      frequency === "monthly"
        ? dayOfMonth ?? baseDate.getDate()
        : undefined;

    const basePayload: Partial<ITraining> = {
      ...payload,
      isRecurring: true,
      recurrence: {
        recurrenceId,
        frequency,
        interval: normalizedInterval,
        daysOfWeek: normalizedDays,
        dayOfMonth: sanitizedDayOfMonth,
        endDate: normalizedEndDate
      }
    };

    const master = await this.create(basePayload);

    const occurrences: ITraining[] = [];
    const timestamps = this.generateOccurrenceDates({
      startDate: baseDate,
      endDate: normalizedEndDate,
      frequency,
      interval: normalizedInterval,
      daysOfWeek: normalizedDays,
      dayOfMonth: sanitizedDayOfMonth
    });

    for (const occurrenceDate of timestamps) {
      if (occurrenceDate.getTime() === baseDate.getTime()) {
        continue;
      }

      const clonePayload: Partial<ITraining> = {
        ...payload,
        date: occurrenceDate,
        isRecurring: true,
        recurrence: basePayload.recurrence,
        participants: [],
        comments: [],
        likes: [],
        status: TrainingStatusEnum.SCHEDULED
      };

      occurrences.push(await this.create(clonePayload));
    }

    return { master, occurrences };
  }

  override async delete(id: string): Promise<boolean> {
    const training = await this.model.findById(id);

    if (!training) {
      throw new NotFoundError("Training");
    }

    const creatorId = training.creator;

    const deleted = await super.delete(id);

    if (deleted && creatorId) {
      await UserModel.findByIdAndUpdate(creatorId, {
        $inc: { countTrainingOrganized: -1 }
      });
    }

    return deleted;
  }

  async getRecommendedTrainings(
    user: IUser,
    populateFields: string | string[],
    maxDistanceKm = 40,
    limit = 10
  ) {
    const now = new Date();
    const userSports = user.sports || [];
    const userLevel = user.trainingLevel;
    const userTimeSlots = user.trainingTimeSlot || [];
    const hasCityCoordinates = user?.city?.location?.coordinates;

    let idsWithDistance: { _id: mongoose.Types.ObjectId; distance?: number }[] =
      [];

    const minResults = limit / 2;

    if (hasCityCoordinates) {
      const [longitude, latitude] = user.city.location?.coordinates || [];

      // distance and sports
      idsWithDistance = await this.model.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [longitude || 0, latitude || 0]
            },
            distanceField: "distance",
            spherical: true,
            maxDistance: maxDistanceKm * 1000
          }
        },
        {
          $match: {
            date: { $gte: now },
            sport: { $in: userSports },
            creator: { $ne: user._id }
          }
        },
        { $project: { _id: 1, distance: 1 } },
        { $limit: limit }
      ]);

      // increase distance and remove sport filter
      if (idsWithDistance.length < minResults) {
        const [longitude, latitude] = user.city.location?.coordinates || [];

        const extra = await this.model.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [longitude || 0, latitude || 0]
              },
              distanceField: "distance",
              spherical: true,
              maxDistance: maxDistanceKm * 5 * 1000
            }
          },
          {
            $match: {
              date: { $gte: now },
              creator: { $ne: user._id }
            }
          },
          { $project: { _id: 1, distance: 1 } },
          { $limit: limit }
        ]);

        // no duplicates
        idsWithDistance = [
          ...idsWithDistance,
          ...extra.filter(
            (e) =>
              !idsWithDistance.find(
                (t) => t._id.toString() === e._id.toString()
              )
          )
        ];
      }
    }

    // Fallback
    if (idsWithDistance.length < limit) {
      const fallback = await this.model
        .find({
          date: { $gte: now },
          creator: { $ne: user._id }
        })
        .sort({ date: 1 })
        .limit(limit - idsWithDistance.length)
        .select("_id")
        .lean();

      idsWithDistance = [
        ...idsWithDistance,
        ...fallback.filter(
          (e) =>
            !idsWithDistance.find((t) => t._id.toString() === e._id.toString())
        )
      ];
    }
    const ids = idsWithDistance.map((item) => item._id);

    const { data } = await this.list({
      pageNum: 1,
      pageSize: limit,
      filters: {
        _id: { $in: ids },
        creator: { $ne: user._id }
      },
      populateFields
    });

    // score
    const trainingsWithScore = data.map((training) => {
      let score = 0;

      if (training.sport && userSports.includes(training.sport)) score += 5;
      if (userLevel && training.difficultyLevel === userLevel) score += 3;

      if (userTimeSlots.length && training.date) {
        const trainingHour = new Date(training.date).getHours();
        const trainingDay = new Date(training.date).getDay();
        const slotMatch = userTimeSlots.some((slot) => {
          const start = parseInt(slot.startTime?.split(":")?.[0], 10);
          const end = parseInt(slot.endTime?.split(":")?.[0], 10);
          return (
            trainingHour >= start &&
            trainingHour <= end &&
            parseInt(slot.day, 10) === trainingDay
          );
        });
        if (slotMatch) score += 2;
      }

      const distanceObj = idsWithDistance.find(
        (i) => i._id.toString() === training._id.toString()
      );
      if (distanceObj?.distance) {
        const distKm = distanceObj.distance / 1000;
        if (distKm <= maxDistanceKm) score += 5;
        else if (distKm <= maxDistanceKm * 2) score += 2;
      }

      return { training, score };
    });

    trainingsWithScore.sort((a, b) => b.score - a.score);

    return trainingsWithScore.map((item) => item.training).slice(0, limit);
  }

  async getPotentialParticipants(training: ITraining, maxDistanceKm = 40) {
    if (!training.location?.coordinates) {
      throw new BadRequestError("Training has no location coordinates");
    }

    const [lng, lat] = training.location.coordinates;
    const nearbyCities: { _id: string }[] = await CityModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distance",
          spherical: true,
          maxDistance: maxDistanceKm * 1000
        }
      },
      {
        $project: { _id: 1 }
      }
    ]);

    const cityIds = nearbyCities.map((city) => city._id);

    const users = await UserModel.find({
      _id: { $ne: training.creator },
      sports: training.sport,
      city: { $in: cityIds }
    });

    return users;
  }

  async addLike(id: string, userId: string) {
    const model = this.model.findByIdAndUpdate(
      id,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    return model;
  }

  async cancelRecurrence(recurrenceId: string, userId: string) {
    if (!recurrenceId) {
      throw new BadRequestError("Recurrence id is required");
    }

    const master = await this.model.findOne({
      "recurrence.recurrenceId": recurrenceId,
      creator: userId
    });

    if (!master) {
      throw new NotFoundError("Recurring training");
    }

    const now = new Date();
    const deleteResult = await this.model.deleteMany({
      "recurrence.recurrenceId": recurrenceId,
      _id: { $ne: master._id },
      date: { $gt: now }
    });

    master.isRecurring = false;
    master.recurrence = undefined;
    await master.save();

    return {
      cancelledCount: deleteResult.deletedCount ?? 0
    };
  }

  async removeLike(id: string, userId: string) {
    const model = this.model.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true }
    );
    return model;
  }

  async addParticipant(id: string, userId: string) {
    const training = await this.model.findById(id);
    if (!training) {
      throw new NotFoundError("Training");
    }

    if (training.status !== TrainingStatusEnum.SCHEDULED) {
      throw new ConflictError(
        "Cannot add participant. Training is not in scheduled status."
      );
    }

    const result = this.model.findOneAndUpdate(
      { _id: id, "participants.participant": { $ne: userId } },
      { $push: { participants: { participant: userId, attended: true } } },
      { new: true }
    );
    return result as unknown as ITraining;
  }
  async removeParticipant(id: string, userId: string) {
    const training = await this.model.findById(id);
    if (!training) {
      throw new NotFoundError("Training");
    }

    if (training.status !== TrainingStatusEnum.SCHEDULED) {
      throw new ConflictError(
        "Cannot remove participant. Training is not in scheduled status."
      );
    }
    const result = this.model.findByIdAndUpdate(
      id,
      { $pull: { participants: { participant: userId } } },
      { new: true }
    );
    return result as unknown as ITraining;
  }

  async addComment(id: string, userId: string, text: string) {
    const comment = await CommentModel.create({ user: userId, text });
    const result = this.model.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      { new: true }
    );
    return result as unknown as ITraining;
  }

  async updateComment(commentId: string, text: string) {
    const result = CommentModel.findByIdAndUpdate(
      commentId,
      { text, updatedAt: new Date() },
      { new: true }
    );
    return result as unknown as ITraining;
  }

  async removeComment(id: string, commentId: string) {
    await CommentModel.deleteOne({ _id: commentId });
    const result = this.model.findByIdAndUpdate(
      id,
      { $pull: { comments: commentId } },
      { new: true }
    );
    return result as unknown as ITraining;
  }

  async replyComment(
    id: string,
    parentCommentId: string,
    userId: string,
    text: string
  ) {
    const reply = await CommentModel.create({ user: userId, text });

    // Push to parent replies
    const parent = await CommentModel.findByIdAndUpdate(
      parentCommentId,
      { $push: { replies: reply._id } },
      { new: true }
    );

    if (!parent) {
      throw new NotFoundError("Parent comment");
    }

    const result = await this.model.findById(id);
    return result as unknown as ITraining;
  }
  async changeStatus(
    id: string,
    userId: string,
    newStatus: TrainingStatusEnum,
    participants: ITrainingParticipant[] = []
  ) {
    const training = await this.model.findById(id);
    if (!training) {
      throw new NotFoundError("Training");
    }

    const validStatuses = [
      TrainingStatusEnum.SCHEDULED,
      TrainingStatusEnum.COMPLETED,
      TrainingStatusEnum.CANCELLED
    ];
    if (!validStatuses.includes(newStatus)) {
      throw new BadRequestError(
        "Invalid status. Must be one of: scheduled, completed, cancelled"
      );
    }

    if (training.creator.toString() !== userId) {
      throw new ForbiddenError("Only the creator can change the status");
    }

    // If changing to completed, award points
    if (
      newStatus === TrainingStatusEnum.COMPLETED &&
      training.status !== TrainingStatusEnum.COMPLETED
    ) {
      // Only award points if there's at least one participant besides the creator
      if (participants && participants.length > 0) {
        // Award 5 points to creator
        await UserModel.findByIdAndUpdate(userId, {
          $inc: { trainingPoints: CONSTANTS.POINT_CREATOR_TRAINING }
        });
        // Log points for leaderboard
        await UserLeaderboardModel.create({
          user: userId,
          points: CONSTANTS.POINT_CREATOR_TRAINING
        });

        // Award 1 point to each participant
        for (const attendance of participants) {
          if (attendance.attended) {
            await UserModel.findByIdAndUpdate(attendance.participant, {
              $inc: {
                countTrainingJoined: 1,
                trainingPoints: CONSTANTS.POINT_JOIN_TRAINING
              }
            });
            // Log points for leaderboard
            await UserLeaderboardModel.create({
              user: attendance.participant,
              points: CONSTANTS.POINT_JOIN_TRAINING
            });
          } else {
            await UserModel.findByIdAndUpdate(attendance.participant, {
              $inc: { countTrainingMissed: 1 }
            });
          }
        }
      }
      this.model.findByIdAndUpdate(
        id,
        { participants: participants },
        { new: true }
      );
    }

    if (
      newStatus === TrainingStatusEnum.CANCELLED &&
      training.status !== TrainingStatusEnum.CANCELLED
    ) {
      await UserModel.findByIdAndUpdate(userId, {
        $inc: { countTrainingOrganized: -1 }
      });
    }

    const result = this.model.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );

    return result as unknown as ITraining;
  }

  private generateOccurrenceDates({
    startDate,
    endDate,
    frequency,
    interval,
    daysOfWeek,
    dayOfMonth
  }: {
    startDate: Date;
    endDate: Date;
    frequency: "daily" | "weekly" | "monthly";
    interval: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
  }): Date[] {
    const occurrences: Date[] = [];

    if (frequency === "daily") {
      const cursor = new Date(startDate);
      while (cursor.getTime() <= endDate.getTime()) {
        occurrences.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + interval);
      }
      return occurrences;
    }

    if (frequency === "weekly") {
      const daySet = new Set(daysOfWeek ?? [startDate.getDay()]);
      const cursor = new Date(startDate);
      while (cursor.getTime() <= endDate.getTime()) {
        const weeksBetween = Math.floor(
          (cursor.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
        );
        if (weeksBetween % interval === 0 && daySet.has(cursor.getDay())) {
          occurrences.push(new Date(cursor));
        }
        cursor.setDate(cursor.getDate() + 1);
      }
      return occurrences;
    }

    // monthly
    const normalizedDay = dayOfMonth ?? startDate.getDate();
    let cursor = new Date(startDate);
    cursor.setDate(normalizedDay);
    while (cursor.getTime() <= endDate.getTime()) {
      if (cursor.getTime() >= startDate.getTime()) {
        occurrences.push(new Date(cursor));
      }
      const next = new Date(cursor);
      next.setMonth(next.getMonth() + interval);
      next.setDate(normalizedDay);
      cursor = next;
    }

    return occurrences;
  }
}
