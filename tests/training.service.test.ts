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
import { TrainingLevelEnum, TrainingStatusEnum } from "../src/types/index.js";

jest.setTimeout(20000);

let mongo: MongoMemoryServer;

const trainingAddress = () => ({
  city: "Rome",
  country: "Italy"
});

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
    address: trainingAddress(),
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
      TrainingStatusEnum.COMPLETED,
      training.participants
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
      address: trainingAddress(),
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
      address: trainingAddress(),
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
      address: trainingAddress(),
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
      address: trainingAddress(),
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

describe("TrainingService.createWithRecurrence", () => {
  it("generates additional trainings for selected weekdays", async () => {
    const creator = await UserModel.create({
      authId: "recurring-creator",
      email: "recurring-creator@test.com"
    });

    const service = new TrainingService();
    const startDate = new Date("2024-01-01T10:00:00.000Z");
    const endDate = new Date("2024-01-15T10:00:00.000Z");

    const { master, occurrences } = await service.createWithRecurrence({
      title: "Morning Run",
      description: "Recurring session",
      creator: creator._id,
      sport: "RUNNING",
      date: startDate,
      address: trainingAddress(),
      location: { type: "Point", coordinates: [0, 0] },
      difficultyLevel: TrainingLevelEnum.BEGINNER,
      duration: 60,
      participants: [],
      likes: [],
      comments: [],
      recurrence: {
        daysOfWeek: [2, 4],
        endDate
      },
      isRecurring: true
    });

    expect(master.isRecurring).toBe(true);
    expect(master.recurrence?.recurrenceId).toBeDefined();
    expect(occurrences.length).toBeGreaterThan(0);

    const total = await TrainingModel.countDocuments({
      "recurrence.recurrenceId": master.recurrence?.recurrenceId
    });
    expect(total).toBe(occurrences.length + 1);
  });

  it("throws when recurrence configuration is invalid", async () => {
    const creator = await UserModel.create({
      authId: "recurring-invalid",
      email: "recurring-invalid@test.com"
    });

    const service = new TrainingService();
    const startDate = new Date("2024-01-01T10:00:00.000Z");

    await expect(
      service.createWithRecurrence({
        title: "Invalid",
        creator: creator._id,
        sport: "RUNNING",
        date: startDate,
        address: trainingAddress(),
        location: { type: "Point", coordinates: [0, 0] },
        recurrence: {
          daysOfWeek: [],
          endDate: new Date("2023-12-01T10:00:00.000Z")
        },
        isRecurring: true
      })
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it("behaves like regular create when recurrence is disabled", async () => {
    const creator = await UserModel.create({
      authId: "recurring-none",
      email: "recurring-none@test.com"
    });

    const service = new TrainingService();
    const { master, occurrences } = await service.createWithRecurrence({
      title: "Single",
      creator: creator._id,
      sport: "RUNNING",
      date: new Date(),
      address: trainingAddress(),
      location: { type: "Point", coordinates: [0, 0] },
      isRecurring: false
    });

    expect(master).toBeDefined();
    expect(occurrences).toHaveLength(0);
  });

  it("supports daily recurrence with interval", async () => {
    const creator = await UserModel.create({
      authId: "recurring-daily",
      email: "recurring-daily@test.com"
    });

    const service = new TrainingService();
    const startDate = new Date("2024-01-01T07:00:00.000Z");
    const endDate = new Date("2024-01-10T07:00:00.000Z");

    const { occurrences } = await service.createWithRecurrence({
      title: "Daily Run",
      creator: creator._id,
      sport: "RUNNING",
      date: startDate,
      address: trainingAddress(),
      location: { type: "Point", coordinates: [0, 0] },
      isRecurring: true,
      recurrence: {
        frequency: "daily",
        interval: 2,
        endDate
      }
    });

    expect(occurrences.length).toBeGreaterThan(0);
    const lastOccurrence = occurrences[occurrences.length - 1];
    expect(lastOccurrence.date.getTime()).toBeLessThanOrEqual(endDate.getTime());
  });

  it("supports monthly recurrence with custom day", async () => {
    const creator = await UserModel.create({
      authId: "recurring-monthly",
      email: "recurring-monthly@test.com"
    });

    const service = new TrainingService();
    const startDate = new Date("2024-01-15T07:00:00.000Z");
    const endDate = new Date("2024-04-30T07:00:00.000Z");

    const { occurrences } = await service.createWithRecurrence({
      title: "Monthly Run",
      creator: creator._id,
      sport: "RUNNING",
      date: startDate,
      address: trainingAddress(),
      location: { type: "Point", coordinates: [0, 0] },
      isRecurring: true,
      recurrence: {
        frequency: "monthly",
        interval: 1,
        dayOfMonth: 20,
        endDate
      }
    });

    expect(occurrences.length).toBeGreaterThanOrEqual(2);
    expect(
      occurrences.every((training) => training.date.getDate() === 20)
    ).toBe(true);
  });

  it("handles weekly recurrence crossing months", async () => {
    const creator = await UserModel.create({
      authId: "recurring-weekly",
      email: "recurring-weekly@test.com"
    });

    const service = new TrainingService();
    const startDate = new Date("2024-01-30T07:00:00.000Z"); // Tuesday
    const endDate = new Date("2024-02-15T07:00:00.000Z");

    const { occurrences } = await service.createWithRecurrence({
      title: "Weekly Run",
      creator: creator._id,
      sport: "RUNNING",
      date: startDate,
      address: trainingAddress(),
      location: { type: "Point", coordinates: [0, 0] },
      isRecurring: true,
      recurrence: {
        frequency: "weekly",
        interval: 1,
        daysOfWeek: [2],
        endDate
      }
    });

    expect(occurrences.length).toBeGreaterThanOrEqual(2);
    expect(
      occurrences.every((training) => training.date.getDay() === 2)
    ).toBe(true);
  });

  it("clips monthly recurrence when day exceeds month length", async () => {
    const creator = await UserModel.create({
      authId: "recurring-monthly-edge",
      email: "recurring-monthly-edge@test.com"
    });

    const service = new TrainingService();
    const startDate = new Date("2024-01-31T07:00:00.000Z");
    const endDate = new Date("2024-03-31T07:00:00.000Z");

    const { occurrences } = await service.createWithRecurrence({
      title: "Monthly Edge Run",
      creator: creator._id,
      sport: "RUNNING",
      date: startDate,
      address: trainingAddress(),
      location: { type: "Point", coordinates: [0, 0] },
      isRecurring: true,
      recurrence: {
        frequency: "monthly",
        interval: 1,
        dayOfMonth: 31,
        endDate
      }
    });

    expect(occurrences.length).toBeGreaterThanOrEqual(1);
    expect(occurrences.every((training) => training.date.getDate() === 31)).toBe(
      true
    );
  });
});
