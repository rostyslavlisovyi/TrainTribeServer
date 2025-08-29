import { Document, Types } from "mongoose";
import { IFileUpload } from "./index.ts";

export interface IReview extends Document {
  reviewer: Types.ObjectId;
  rating: number;
  comment?: string;
  images?: IFileUpload[];
  createdAt: Date;
}
