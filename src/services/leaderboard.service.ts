import { PipelineStage } from "mongoose";
import UserLeaderboardModel from "../models/MongoDB/userLeaderboard.model.js";

export class LeaderboardService {
  async getMonthlyLeaderboard(options?: { search?: string }) {
    const { search } = options ?? {};

    const MAX_MONTHS_BACK = 3;

    const getLeaderboardForMonth = async (
      startOfMonth: Date,
      endOfMonth: Date
    ) => {
      const aggregation: PipelineStage[] = [
        {
          $match: {
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
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

      return await UserLeaderboardModel.aggregate(aggregation);
    };

    // Try to get leaderboard for current month and up to 3 previous months
    for (let monthsBack = 0; monthsBack <= MAX_MONTHS_BACK; monthsBack++) {
      const startOfMonth = new Date();
      startOfMonth.setMonth(startOfMonth.getMonth() - monthsBack);
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      const leaderboard = await getLeaderboardForMonth(
        startOfMonth,
        endOfMonth
      );

      if (leaderboard.length > 0) {
        return leaderboard;
      }
    }

    return [];
  }
}
