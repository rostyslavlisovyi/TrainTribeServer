import { Document, ObjectId, Types } from "mongoose";

export interface IComment extends Document<ObjectId> {
  user: Types.ObjectId;
  text: string;
}
