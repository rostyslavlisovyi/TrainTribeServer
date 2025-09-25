import { Request, Response } from "express";
import { BaseResponse } from "../models/index.js";
import { LeaderboardService } from "../services/leaderboard.service.js";

export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  async getMonthlyLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const leaderboard =
        await this.leaderboardService.getMonthlyLeaderboard(search);
      res.status(200).json(new BaseResponse(leaderboard));
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }
}
