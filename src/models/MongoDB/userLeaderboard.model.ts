import mongoose, { Model, Schema } from "mongoose";
import { IUserLeaderboard } from "../../interfaces/userLeaderboard.interface.js";

const UserLeaderboardSchema = new Schema<IUserLeaderboard>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const UserLeaderboardModel: Model<IUserLeaderboard> =
  mongoose.model<IUserLeaderboard>("UserLeaderboard", UserLeaderboardSchema);

export default UserLeaderboardModel;
