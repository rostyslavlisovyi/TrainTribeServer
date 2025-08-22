import mongoose, { Model, Schema } from "mongoose";
import { IReview } from "../../interfaces/review.interface.js";

const ReviewSchema = new Schema<IReview>(
  {
    reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    images: [{ type: Schema.Types.Mixed }],
    createdAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

const ReviewModel: Model<IReview> = mongoose.model("Review", ReviewSchema);
export default ReviewModel;
