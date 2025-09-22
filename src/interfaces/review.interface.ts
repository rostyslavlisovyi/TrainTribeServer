import { Document, ObjectId } from "mongoose";
import { IFileUpload } from "./index.js";

export interface IReview extends Document {
  training: ObjectId;
  reviewer: ObjectId;
  reviewedUser: ObjectId;
  stars: number;
  comment: string;
  images?: IFileUpload[];
  createdAt: Date;
  updatedAt: Date;
}
