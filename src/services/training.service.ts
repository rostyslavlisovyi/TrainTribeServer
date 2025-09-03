import { ObjectId } from "mongoose";
import { IFileUpload, ITraining, IUser } from "../interfaces/index.js";
import CommentModel from "../models/MongoDB/comment.model.js";
import ReviewModel from "../models/MongoDB/review.model.js";
import TrainingModel from "../models/MongoDB/training.model.js";
import UserModel from "../models/MongoDB/user.model.js";
import { TrainingStatusEnum } from "../types/index.js";
import { BaseService } from "./base.service.js";

export class TrainingService extends BaseService<ITraining> {
  constructor() {
    super(TrainingModel);
  }
  async create(entity: Partial<ITraining>): Promise<{ data: ITraining }> {
    const { data: newTraining } = await super.create(entity);

    if (newTraining && newTraining.creator) {
      await UserModel.findByIdAndUpdate(newTraining.creator, {
        $inc: { countTrainingOrganized: 1 }
      });
    }

    return { data: newTraining };
  }

  async delete(id: string): Promise<{ data: boolean }> {
    const training = await this.model.findById(id);

    if (!training) {
      throw new Error("Training not found");
    }

    const creatorId = training.creator;

    const { data: deleted } = await super.delete(id);

    if (deleted && creatorId) {
      await UserModel.findByIdAndUpdate(creatorId, {
        $inc: { countTrainingOrganized: -1 }
      });
    }

    return { data: deleted };
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

    const hasCityCoordinates =
      user.city &&
      user.city.longitude !== undefined &&
      user.city.latitude !== undefined;

    let idsWithDistance: { _id: ObjectId; distance?: number }[] = [];

    const minResults = limit / 2;

    if (hasCityCoordinates) {
      // distance and sports
      idsWithDistance = await this.model.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [user.city.longitude || 0, user.city.latitude || 0]
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
        const extra = await this.model.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [user.city.longitude || 0, user.city.latitude || 0]
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

  async addLike(id: string, userId: string) {
    return this.model.findByIdAndUpdate(
      id,
      { $addToSet: { likes: userId } },
      { new: true }
    );
  }

  async removeLike(id: string, userId: string) {
    return this.model.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true }
    );
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

    const newParticipant = { participant: userId, attended: true };
    return this.model.findByIdAndUpdate(
      id,
      { $addToSet: { participantAttendance: newParticipant } },
      { new: true }
    );
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
    return this.model.findByIdAndUpdate(
      id,
      { $pull: { participantAttendance: { participant: userId } } },
      { new: true }
    );
  }

  async addComment(id: string, userId: string, text: string) {
    const comment = await CommentModel.create({ user: userId, text });
    return this.model.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      { new: true }
    );
  }

  async updateComment(commentId: string, text: string) {
    return CommentModel.findByIdAndUpdate(
      commentId,
      { text, updatedAt: new Date() },
      { new: true }
    );
  }

  async removeComment(id: string, commentId: string) {
    await CommentModel.deleteOne({ _id: commentId });
    return this.model.findByIdAndUpdate(
      id,
      { $pull: { comments: commentId } },
      { new: true }
    );
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
      if (
        training.participantAttendance &&
        training.participantAttendance.length > 0
      ) {
        // Award 5 points to creator
        await UserModel.findByIdAndUpdate(userId, {
          $inc: { trainingPoints: 5 }
        });

        // Award 1 point to each participant
        for (const attendance of training.participantAttendance) {
          if (attendance.attended) {
            await UserModel.findByIdAndUpdate(attendance.participant, {
              $inc: { countTrainingJoined: 1, trainingPoints: 1 }
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

    return this.model.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );
  }

  async addReview(
    trainingId: string,
    reviewerId: string,
    rating: number,
    comment?: string,
    images?: IFileUpload[]
  ) {
    // Find the training
    const training = await this.model.findById(trainingId);
    if (!training) {
      throw new Error("Training not found");
    }
    // Check training status
    if (training.status !== TrainingStatusEnum.COMPLETED) {
      throw new Error("Training must be completed before it can be reviewed");
    }
    // Check if the reviewer is a participant
    const isParticipant =
      training.participantAttendance &&
      training.participantAttendance.some(
        (attendance) => attendance.participant.toString() === reviewerId
      );
    if (!isParticipant) {
      throw new Error("Only participants can add reviews");
    }
    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Check if the reviewer has already reviewed this training
    const existingReview = await ReviewModel.findOne({
      training: trainingId,
      reviewer: reviewerId
    });

    if (existingReview) {
      throw new Error("You have already reviewed this training");
    }

    // Create the review
    const review = await ReviewModel.create({
      training: trainingId,
      reviewer: reviewerId,
      rating,
      comment,
      images
    });

    // Add review to training
    await this.model.findByIdAndUpdate(trainingId, {
      $addToSet: { reviews: review._id }
    });

    // Update creator's reviewPoints
    await UserModel.findByIdAndUpdate(training.creator, {
      $inc: { reviewPoints: rating }
    });

    return review;
  }
}
