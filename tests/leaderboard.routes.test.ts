import express from "express";
import request from "supertest";
import type { AwilixContainer } from "awilix";
import leaderboardRoutes from "../src/routes/leaderboard.routes.js";
import { LeaderboardController } from "../src/controllers/leaderboard.controller.js";

const verifyIdToken = jest.fn(async () => ({
  uid: "auth-user",
  user_id: "auth-user"
}));

jest.mock("firebase-admin/auth", () => ({
  getAuth: () => ({ verifyIdToken })
}));

const createApp = () => {
  const leaderboardService = {
    getMonthlyLeaderboard: jest.fn().mockResolvedValue([
      {
        user: { _id: "user1", firstName: "Alice", lastName: "Runner" },
        totalPoints: 42
      }
    ])
  };
  const controller = new LeaderboardController(leaderboardService as never);

  const container = {
    resolve: () => controller
  } as unknown as AwilixContainer;

  const app = express();
  app.use((req, _res, next) => {
    (req as any).container = container;
    next();
  });
  app.use("/leaderboard", leaderboardRoutes);

  return { app, leaderboardService };
};

describe("Leaderboard routes", () => {
  beforeEach(() => {
    verifyIdToken.mockClear();
  });

  it("returns the monthly leaderboard for authenticated requests", async () => {
    const { app, leaderboardService } = createApp();

    const response = await request(app)
      .get("/leaderboard/list")
      .set("Authorization", "Bearer test-token")
      .query({ search: "Ali" })
      .expect(200);

    expect(verifyIdToken).toHaveBeenCalledWith("test-token");
    expect(leaderboardService.getMonthlyLeaderboard).toHaveBeenCalledWith({
      search: "Ali"
    });
    expect(response.body.data[0].totalPoints).toBe(42);
  });

  it("rejects requests without Authorization header", async () => {
    const { app, leaderboardService } = createApp();

    const response = await request(app).get("/leaderboard/list").expect(401);

    expect(response.body.message).toBe("UNAUTHORIZED");
    expect(leaderboardService.getMonthlyLeaderboard).not.toHaveBeenCalled();
  });
});
