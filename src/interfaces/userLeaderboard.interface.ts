import mongoose from "mongoose";

export interface IUserLeaderboard {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  points: number;
  createdAt: Date;
}
