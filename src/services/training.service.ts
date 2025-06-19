import CommentModel from "../models/MongoDB/comment.model.js";
import { ITraining } from "../interfaces/index.js";
import TrainingModel from "../models/MongoDB/training.model.js";
import UserModel from "../models/MongoDB/user.model.js";
import ReviewModel from "../models/MongoDB/review.model.js";

import { BaseService } from "./base.service.js";
import { TrainingStatusEnum } from "../types/index.js";

export class TrainingService extends BaseService<ITraining> {
  constructor() {
    super(TrainingModel);
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
    return this.model.findByIdAndUpdate(
      id,
      { $addToSet: { participants: userId } },
      { new: true }
    );
  }

  async removeParticipant(id: string, userId: string) {
    return this.model.findByIdAndUpdate(
      id,
      { $pull: { participants: userId } },
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
    // First check if the user is the creator of the training
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

    // Check if the user is the creator
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
          $inc: { training_points: 5 }
        });

        // Award 1 point to each participant
        for (const participantId of training.participants) {
          await UserModel.findByIdAndUpdate(participantId, {
            $inc: { training_points: 1 }
          });
        }
      }
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
    images?: string[]
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
      training.participants &&
      training.participants.some(
        (participantId) => participantId.toString() === reviewerId
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

    // Update creator's review_points
    await UserModel.findByIdAndUpdate(training.creator, {
      $inc: { review_points: rating }
    });

    return review;
  }
}
