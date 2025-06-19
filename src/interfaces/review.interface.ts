import { Document, Types } from "mongoose";

export interface IReview extends Document {
  reviewer: Types.ObjectId;
  rating: number;
  comment?: string;
  images?: string[];
  createdAt: Date;
}
