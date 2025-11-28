import { PipelineStage } from "mongoose";
import UserLeaderboardModel from "../models/MongoDB/userLeaderboard.model.js";

export class LeaderboardService {
  async getMonthlyLeaderboard(options?: { search?: string }) {
    const { search } = options ?? {};

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const now = new Date();

    const aggregation: PipelineStage[] = [
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: now }
        }
      },
      {
        $group: {
          _id: "$user",
          totalPoints: { $sum: "$points" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" }
    ];

    if (search && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");

      aggregation.push({
        $match: {
          $or: [{ "user.firstName": regex }, { "user.lastName": regex }]
        }
      });
    }

    aggregation.push(
      {
        $project: {
          user: "$user",
          totalPoints: 1
        }
      },
      {
        $sort: { totalPoints: -1 }
      }
    );

    const leaderboard = await UserLeaderboardModel.aggregate(aggregation);

    return leaderboard;
  }
}
