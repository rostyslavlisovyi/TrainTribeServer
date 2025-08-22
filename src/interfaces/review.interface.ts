import { Document, Types } from "mongoose";
import { FileUpload } from "types/enums.ts";

export interface IReview extends Document {
  reviewer: Types.ObjectId;
  rating: number;
  comment?: string;
  images?: FileUpload[];
  createdAt: Date;
}
