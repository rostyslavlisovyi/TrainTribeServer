import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError
} from "../src/errors/index.js";
import TrainingModel from "../src/models/MongoDB/training.model.js";
import UserModel from "../src/models/MongoDB/user.model.js";
import UserLeaderboardModel from "../src/models/MongoDB/userLeaderboard.model.js";
import { TrainingService } from "../src/services/training.service.js";
import { TrainingStatusEnum } from "../src/types/index.js";

jest.setTimeout(20000);

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
  await UserLeaderboardModel.deleteMany({});
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
    location: {
      type: "Point",
      coordinates: [0, 0]
    },
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

  it("throws BadRequestError on invalid state change", async () => {
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

describe("TrainingService.addParticipant", () => {
  it("throws NotFoundError when training is missing", async () => {
    const service = new TrainingService();

    await expect(
      service.addParticipant(
        new mongoose.Types.ObjectId().toString(),
        new mongoose.Types.ObjectId().toString()
      )
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("prevents adding participants when training is not scheduled", async () => {
    const service = new TrainingService();
    const creator = await UserModel.create({
      authId: "creator-status",
      email: "creator-status@test.com"
    });
    const participant = await UserModel.create({
      authId: "participant-status",
      email: "participant-status@test.com"
    });

    const training = await TrainingModel.create({
      title: "Cancelled",
      creator: creator._id,
      status: TrainingStatusEnum.CANCELLED,
      sport: "RUNNING",
      date: new Date(),
      address: "Test",
      location: { type: "Point", coordinates: [0, 0] },
      participants: []
    });

    await expect(
      service.addParticipant(
        training._id.toString(),
        participant._id.toString()
      )
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("adds the participant only once", async () => {
    const service = new TrainingService();
    const creator = await UserModel.create({
      authId: "creator-add",
      email: "creator-add@test.com"
    });
    const participant = await UserModel.create({
      authId: "participant-add",
      email: "participant-add@test.com"
    });

    const training = await TrainingModel.create({
      title: "Group Run",
      creator: creator._id,
      status: TrainingStatusEnum.SCHEDULED,
      sport: "RUNNING",
      date: new Date(),
      address: "Park",
      location: { type: "Point", coordinates: [0, 0] },
      participants: []
    });

    const firstJoin = await service.addParticipant(
      training._id.toString(),
      participant._id.toString()
    );
    expect(firstJoin?.participants).toHaveLength(1);
    expect(firstJoin?.participants?.[0].attended).toBe(true);

    const secondJoin = await service.addParticipant(
      training._id.toString(),
      participant._id.toString()
    );
    expect(secondJoin).toBeNull();

    const refreshedTraining = await TrainingModel.findById(training._id);
    expect(refreshedTraining?.participants).toHaveLength(1);
  });
});

describe("TrainingService.removeParticipant", () => {
  it("throws NotFoundError when training is missing", async () => {
    const service = new TrainingService();
    await expect(
      service.removeParticipant(
        new mongoose.Types.ObjectId().toString(),
        new mongoose.Types.ObjectId().toString()
      )
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("prevents removing participants when training is not scheduled", async () => {
    const service = new TrainingService();
    const creator = await UserModel.create({
      authId: "creator-remove",
      email: "creator-remove@test.com"
    });
    const participant = await UserModel.create({
      authId: "participant-remove",
      email: "participant-remove@test.com"
    });

    const training = await TrainingModel.create({
      title: "Cancelled",
      creator: creator._id,
      status: TrainingStatusEnum.CANCELLED,
      sport: "RUNNING",
      date: new Date(),
      address: "Test",
      location: { type: "Point", coordinates: [0, 0] },
      participants: [
        {
          participant: participant._id,
          attended: true
        }
      ]
    });

    await expect(
      service.removeParticipant(
        training._id.toString(),
        participant._id.toString()
      )
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("removes an existing participant", async () => {
    const service = new TrainingService();
    const creator = await UserModel.create({
      authId: "creator-remove-ok",
      email: "creator-remove-ok@test.com"
    });
    const participant = await UserModel.create({
      authId: "participant-remove-ok",
      email: "participant-remove-ok@test.com"
    });

    const training = await TrainingModel.create({
      title: "Intervals",
      creator: creator._id,
      status: TrainingStatusEnum.SCHEDULED,
      sport: "RUNNING",
      date: new Date(),
      address: "Track",
      location: { type: "Point", coordinates: [0, 0] },
      participants: [
        {
          participant: participant._id,
          attended: true
        }
      ]
    });

    const updated = await service.removeParticipant(
      training._id.toString(),
      participant._id.toString()
    );

    expect(updated?.participants).toHaveLength(0);
  });
});
