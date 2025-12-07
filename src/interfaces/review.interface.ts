import mongoose, { Document } from "mongoose";
import { IFileUpload } from "./index.js";

export interface IReview extends Document {
  training: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  reviewedUser: mongoose.Types.ObjectId;
  stars: number;
  comment: string;
  images?: IFileUpload[];
  createdAt: Date;
  updatedAt: Date;
}
