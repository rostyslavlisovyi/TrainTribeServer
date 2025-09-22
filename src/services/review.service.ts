import { AuthResult } from "express-oauth2-jwt-bearer";
import { IReview } from "../interfaces/index.js";
import { ReviewModel, TrainingModel, UserModel } from "../models/index.js";
import { TrainingStatusEnum } from "../types/index.js";
import { BaseService } from "./base.service.js";

export class ReviewService extends BaseService<IReview> {
  constructor(auth?: AuthResult) {
    super(ReviewModel, auth);
  }

  //Create review
  async create(entity: Partial<IReview>): Promise<IReview> {
    const { training: trainingId, reviewedUser, stars } = entity;

    // Verify the training exists
    const training = await TrainingModel.findById(trainingId);
    if (!training) {
      throw new Error("Training not found");
    }

    // Check training status - must be completed
    if (training.status !== TrainingStatusEnum.COMPLETED) {
      throw new Error("Training must be completed before it can be reviewed");
    }

    // Check if the reviewer is a participant
    const isParticipant =
      training.participants &&
      training.participants.some(
        (attendance) =>
          attendance.participant.toString() === entity.reviewer?.toString()
      );

    if (!isParticipant) {
      throw new Error("Only participants can add reviews");
    }

    // Validate rating
    if (!stars || stars < 1 || stars > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Check if user has already reviewed this training
    const existingReview = await ReviewModel.findOne({
      training: trainingId,
      reviewer: entity.reviewer
    });

    if (existingReview) {
      throw new Error("You have already reviewed this training");
    }

    // Create the review using parent method
    const newReview = await super.create(entity);

    // Update the reviewed user's points
    if (stars && stars > 0) {
      await UserModel.findByIdAndUpdate(
        reviewedUser,
        { $inc: { reviewPoints: stars } },
        { new: true }
      );
    }

    // Update hasLeftReview for the participant
    await TrainingModel.findOneAndUpdate(
      {
        _id: trainingId,
        "participants.participant": entity.reviewer
      },
      {
        $set: { "participants.$.hasLeftReview": true }
      }
    );

    return newReview;
  }

  //Delete method to remove points
  async delete(id: string): Promise<boolean> {
    const review = await this.model.findById(id);
    if (!review) {
      throw new Error("Review not found");
    }

    // Remove the stars from the user's review points
    if (review.stars && review.stars > 0) {
      await UserModel.findByIdAndUpdate(
        review.reviewedUser,
        { $inc: { reviewPoints: -review.stars } },
        { new: true }
      );
    }

    const result = await super.delete(id);

    return result;
  }

  // Update a review with authorization check
  async updateReview(
    reviewId: string,
    updateData: Partial<IReview>,
    userId: string
  ): Promise<IReview | null> {
    const review = await this.model.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    // Only the reviewer can update their review
    if (review.reviewer.toString() !== userId) {
      throw new Error("Not authorized to update this review");
    }

    // If stars are being updated, adjust the user's review points
    if (updateData.stars !== undefined && updateData.stars !== review.stars) {
      const pointDiff = updateData.stars - (review.stars || 0);

      if (pointDiff !== 0) {
        await UserModel.findByIdAndUpdate(
          review.reviewedUser,
          { $inc: { reviewPoints: pointDiff } },
          { new: true }
        );
      }
    }

    const updatedReview = await this.model.findByIdAndUpdate(
      reviewId,
      updateData,
      { new: true }
    );

    return updatedReview;
  }

  //Delete a review with authorization check
  async deleteReview(reviewId: string, userId: string): Promise<boolean> {
    const review = await this.model.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    // Only the reviewer can delete the review
    if (review.reviewer.toString() !== userId) {
      throw new Error("Not authorized to delete this review");
    }

    // Use the overridden delete method which handles point removal
    return await this.delete(reviewId);
  }
}

export default ReviewService;
