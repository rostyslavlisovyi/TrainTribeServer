import { Document, Types } from "mongoose";
import { IFileUpload } from "./index.js";

export interface IReview extends Document {
  training: Types.ObjectId;
  reviewer: Types.ObjectId;
  reviewedUser: Types.ObjectId;
  stars: number;
  comment: string;
  images?: IFileUpload[];
  createdAt: Date;
  updatedAt: Date;
}
