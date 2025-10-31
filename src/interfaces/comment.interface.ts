import mongoose, { Document } from "mongoose";

export interface IComment extends Document<mongoose.Types.ObjectId> {
  user: mongoose.Types.ObjectId;
  text: string;
  replies: mongoose.Types.ObjectId[];
}
