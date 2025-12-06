import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
jest.setTimeout(30000);
import { TrainingStatusEnum } from "../src/types/index.js";
import TrainingModel from "../src/models/MongoDB/training.model.js";
import UserModel from "../src/models/MongoDB/user.model.js";
import { TrainingService } from "../src/services/training.service.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError
} from "../src/errors/index.js";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

afterEach(async () => {
  await TrainingModel.deleteMany({});
  await UserModel.deleteMany({});
});

async function seedTraining(
  status: TrainingStatusEnum = TrainingStatusEnum.SCHEDULED
) {
  const creator = await UserModel.create({
    authId: "creator",
    email: "creator@test.com"
  });
  const trainee = await UserModel.create({
    authId: "user",
    email: "user@test.com"
  });

  const training = await TrainingModel.create({
    title: "Test",
    creator: creator._id,
    status,
    sport: "RUNNING",
    date: new Date(),
    address: "Test address",
    location: { type: "Point", coordinates: [12, 50] },
    participants: [
      {
        participant: trainee._id,
        attended: true
      }
    ]
  });

  return { training, creator, trainee };
}

describe("TrainingService.changeStatus", () => {
  it("throws NotFoundError when training does not exist", async () => {
    const service = new TrainingService();
    await expect(
      service.changeStatus(
        new mongoose.Types.ObjectId().toString(),
        "user",
        TrainingStatusEnum.COMPLETED
      )
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws ForbiddenError when user is not creator", async () => {
    const service = new TrainingService();
    const { training, trainee } = await seedTraining();

    await expect(
      service.changeStatus(
        training._id.toString(),
        trainee._id.toString(),
        TrainingStatusEnum.COMPLETED
      )
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("throws ConflictError on invalid state change", async () => {
    const service = new TrainingService();
    const { training, creator } = await seedTraining(
      TrainingStatusEnum.COMPLETED
    );

    await expect(
      service.changeStatus(
        training._id.toString(),
        creator._id.toString(),
        "INVALID" as TrainingStatusEnum
      )
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it("completes training and awards points", async () => {
    const service = new TrainingService();
    const { training, creator, trainee } = await seedTraining();

    const updated = await service.changeStatus(
      training._id.toString(),
      creator._id.toString(),
      TrainingStatusEnum.COMPLETED
    );

    expect(updated?.status).toBe(TrainingStatusEnum.COMPLETED);

    const refreshedCreator = await UserModel.findById(creator._id);
    expect(refreshedCreator?.trainingPoints).toBeGreaterThanOrEqual(1);

    const refreshedParticipant = await UserModel.findById(trainee._id);
    expect(refreshedParticipant?.countTrainingJoined).toBeGreaterThanOrEqual(1);
  });
});
