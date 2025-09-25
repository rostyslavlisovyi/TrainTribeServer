import { PipelineStage } from "mongoose";
import UserLeaderboardModel from "../models/MongoDB/userLeaderboard.model.js";

export class LeaderboardService {
  async getMonthlyLeaderboard(search?: string) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const now = new Date();

    const matchStage: PipelineStage = {
      $match: {
        createdAt: { $gte: startOfMonth, $lte: now }
      }
    };

    const aggregation: PipelineStage[] = [
      matchStage,
      {
        $group: {
          _id: "$user",
          totalPoints: { $sum: "$points" }
        }
      },
      {
        $sort: { totalPoints: -1 }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      }
    ];

    if (search) {
      aggregation.push({
        $match: {
          $or: [
            { "user.firstName": { $regex: search, $options: "i" } },
            { "user.lastName": { $regex: search, $options: "i" } }
          ]
        }
      });
    }

    aggregation.push({
      $project: {
        user: "$_id",
        totalPoints: 1,
        firstName: "$user.firstName",
        lastName: "$user.lastName",
        image: "$user.image"
      }
    });

    const leaderboard = await UserLeaderboardModel.aggregate(aggregation);

    return leaderboard;
  }
}
