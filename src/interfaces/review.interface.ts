import { Document, ObjectId } from "mongoose";
import { IFileUpload, IUser } from "./index.ts";

export interface IReview extends Document<ObjectId> {
  reviewer: IUser;
  rating: number;
  comment?: string;
  images?: IFileUpload[];
  createdAt: Date;
}
