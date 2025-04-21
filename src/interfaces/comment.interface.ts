import { Document, Types } from "mongoose";

export interface IComment extends Document {
  user: Types.ObjectId;
  text: string;
}
