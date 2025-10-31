import { AuthResult } from "express-oauth2-jwt-bearer";
import mongoose from "mongoose";
import { CONSTANTS } from "../config/app.config.js";
import { ITraining, IUser } from "../interfaces/index.js";
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

  override async create(entity: Partial<ITraining>): Promise<ITraining> {
    const newTraining = await super.create(entity);
    if (newTraining && newTraining.creator) {
      await UserModel.findByIdAndUpdate(newTraining.creator, {
        $inc: { countTrainingOrganized: 1 }
      });
    }

    return newTraining;
  }

  override async delete(id: string): Promise<boolean> {
    const training = await this.model.findById(id);

    if (!training) {
      throw new Error("Training not found");
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
          const start = parseInt(slot.startTime.split(":")[0], 10);
          const end = parseInt(slot.endTime.split(":")[0], 10);
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
      throw new Error("Training has no location coordinates");
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
      throw new Error("Training not found");
    }

    if (training.status !== TrainingStatusEnum.SCHEDULED) {
      throw new Error(
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
      throw new Error("Training not found");
    }

    if (training.status !== TrainingStatusEnum.SCHEDULED) {
      throw new Error(
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
      throw new Error("Parent comment not found");
    }

    const result = await this.model.findById(id);
    return result as unknown as ITraining;
  }
  async changeStatus(
    id: string,
    userId: string,
    newStatus: TrainingStatusEnum
  ) {
    const training = await this.model.findById(id);
    if (!training) {
      throw new Error("Training not found");
    }

    const validStatuses = [
      TrainingStatusEnum.SCHEDULED,
      TrainingStatusEnum.COMPLETED,
      TrainingStatusEnum.CANCELLED
    ];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(
        "Invalid status. Must be one of: scheduled, completed, cancelled"
      );
    }

    if (training.creator.toString() !== userId) {
      throw new Error("Only the creator can change the status");
    }

    // If changing to completed, award points
    if (
      newStatus === TrainingStatusEnum.COMPLETED &&
      training.status !== TrainingStatusEnum.COMPLETED
    ) {
      // Only award points if there's at least one participant besides the creator
      if (training.participants && training.participants.length > 0) {
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
        for (const attendance of training.participants) {
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
}
