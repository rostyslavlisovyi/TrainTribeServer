import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import UserModel from "../src/models/MongoDB/user.model.js";
import UserLeaderboardModel from "../src/models/MongoDB/userLeaderboard.model.js";
import { LeaderboardService } from "../src/services/leaderboard.service.js";

describe("LeaderboardService", () => {
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  });

  afterEach(async () => {
    await Promise.all([UserModel.deleteMany({}), UserLeaderboardModel.deleteMany({})]);
  });

  const createUser = async (
    overrides: Partial<{ firstName: string; lastName: string; authId: string }> = {}
  ) => {
    return await UserModel.create({
      authId: overrides.authId ?? `auth-${new mongoose.Types.ObjectId().toString()}`,
      email: `${new mongoose.Types.ObjectId().toString()}@test.com`,
      firstName: overrides.firstName ?? "Runner",
      lastName: overrides.lastName ?? "One"
    });
  };

  const createEntry = async (
    userId: mongoose.Types.ObjectId,
    points: number,
    createdAt: Date
  ) => {
    await UserLeaderboardModel.create({ user: userId, points, createdAt });
  };

  it("aggregates leaderboard for current month", async () => {
    const service = new LeaderboardService();
    const alice = await createUser({ firstName: "Alice" });
    const bob = await createUser({ firstName: "Bob" });

    const now = new Date();
    await createEntry(alice._id, 10, now);
    await createEntry(alice._id, 15, now);
    await createEntry(bob._id, 5, now);

    const leaderboard = await service.getMonthlyLeaderboard();

    expect(leaderboard).toHaveLength(2);
    expect(leaderboard[0].totalPoints).toBe(25);
    expect(leaderboard[0].user.firstName).toBe("Alice");
  });

  it("filters by search string", async () => {
    const service = new LeaderboardService();
    const alice = await createUser({ firstName: "Alice", lastName: "Swift" });
    const bob = await createUser({ firstName: "Bob", lastName: "Runner" });

    const now = new Date();
    await createEntry(alice._id, 20, now);
    await createEntry(bob._id, 20, now);

    const filtered = await service.getMonthlyLeaderboard({ search: "swi" });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].user.firstName).toBe("Alice");
  });

  it("ignores entries from previous months", async () => {
    const service = new LeaderboardService();
    const user = await createUser({ firstName: "Charlie" });

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    await createEntry(user._id, 30, lastMonth);

    const leaderboard = await service.getMonthlyLeaderboard();

    expect(leaderboard).toHaveLength(0);
  });
});
