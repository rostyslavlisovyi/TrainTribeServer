import mongoose, { Model, ObjectId, Schema } from "mongoose";
import { IReview } from "../../interfaces/review.interface.js";

const ReviewSchema = new Schema<IReview>(
  {
    training: { type: Schema.Types.ObjectId, ref: "Training", required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewedUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    stars: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    images: [{ type: Schema.Types.Mixed }]
  },
  {
    timestamps: true
  }
);

// Unique index to prevent duplicate reviews
ReviewSchema.index(
  { training: 1, reviewer: 1, reviewedUser: 1 },
  { unique: true }
);

// Function to update user's average rating
async function updateUserAverageRating(userId: ObjectId) {
  const UserModel = mongoose.model("User");

  const result = await ReviewModel.aggregate([
    { $match: { reviewedUser: userId } },
    {
      $group: {
        _id: "$reviewedUser",
        averageRating: { $avg: "$stars" },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  const averageRating =
    result.length > 0 ? Math.round(result[0].averageRating * 10) / 10 : 0;

  await UserModel.findByIdAndUpdate(userId, {
    averageRating: averageRating
  });
}

ReviewSchema.post("save", async function () {
  await updateUserAverageRating(this.reviewedUser);
});

ReviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await updateUserAverageRating(doc.reviewedUser);
  }
});

ReviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await updateUserAverageRating(doc.reviewedUser);
  }
});

const ReviewModel: Model<IReview> = mongoose.model("Review", ReviewSchema);
export default ReviewModel;
