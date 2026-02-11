import express, { Request } from "express";
import request from "supertest";
import { LeaderboardController } from "../src/controllers/leaderboard.controller.js";
import type { RequestContext } from "../src/context/requestContext.js";
import { authenticate } from "../src/middlewares/index.js";
import leaderboardRoutes from "../src/routes/leaderboard.routes.js";

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

  const app = express();
  app.use(authenticate);
  app.use((req, _res, next) => {
    (req as Request & { context: RequestContext }).context = {
      auth: undefined,
      services: {} as never,
      controllers: {
        leaderboardController: controller
      } as RequestContext["controllers"]
    } as RequestContext;
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
