import { TrainingModel } from "../models/index.js";
import { NotificationEnum, TrainingStatusEnum } from "../types/enums.js";
import { NotificationService } from "./notification.service.js";

export class CronJobService {
  private readonly notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  async createNotificationTrainingCompletionReminder(offsetMinutes = 60) {
    const now = new Date();
    const romeNow = new Date(
      now.toLocaleString("en-US", { timeZone: "Europe/Rome" })
    );

    if (romeNow.getHours() < 7) {
      return 0;
    }

    const expiredTrainings = await TrainingModel.find({
      status: TrainingStatusEnum.SCHEDULED,
      $expr: {
        $lte: [
          {
            $add: [
              "$date",
              { $multiply: ["$duration", 60000] },
              offsetMinutes * 60000
            ]
          },
          now
        ]
      }
    });

    const trainingsByCreator = new Map();

    for (const training of expiredTrainings) {
      const creatorId = training.creator.toString();
      if (!trainingsByCreator.has(creatorId)) {
        trainingsByCreator.set(creatorId, {
          creator: training.creator,
          trainings: []
        });
      }
      trainingsByCreator.get(creatorId).trainings.push(training);
    }

    for (const { creator, trainings } of trainingsByCreator.values()) {
      const hasReceived = await this.notificationService.hasReceivedTypeToday(
        creator,
        NotificationEnum.TRAINING_COMPLETION_REMINDER
      );
      if (!hasReceived) {
        for (const training of trainings) {
          await this.notificationService.create({
            user: creator,
            triggeredBy: creator,
            type: NotificationEnum.TRAINING_COMPLETION_REMINDER,
            data: {
              trainingId: training._id.toString(),
              trainingTitle: training.title
            }
          });
        }
      }
    }

    return expiredTrainings.length;
  }

  async createNotificationTodayTrainingsReminder() {
    const now = new Date();

    const fiveHoursFromNow = new Date(now.getTime() + 5 * 60 * 60 * 1000);

    const upcomingTrainings = await TrainingModel.find({
      status: TrainingStatusEnum.SCHEDULED,
      date: { $gt: now, $lte: fiveHoursFromNow }
    });

    const trainingsByCreator = new Map();

    for (const training of upcomingTrainings) {
      const creatorId = training.creator.toString();
      if (!trainingsByCreator.has(creatorId)) {
        trainingsByCreator.set(creatorId, {
          creator: training.creator,
          trainings: []
        });
      }
      trainingsByCreator.get(creatorId).trainings.push(training);
    }

    for (const { creator, trainings } of trainingsByCreator.values()) {
      const hasReceived = await this.notificationService.hasReceivedTypeToday(
        creator,
        NotificationEnum.TODAY_TRAININGS_REMINDER
      );
      if (!hasReceived) {
        for (const training of trainings) {
          await this.notificationService.create({
            user: creator,
            triggeredBy: creator,
            type: NotificationEnum.TODAY_TRAININGS_REMINDER,
            data: {
              trainingId: training._id.toString(),
              trainingTitle: training.title
            }
          });
        }
      }
    }

    const trainingsByParticipant = new Map();

    for (const training of upcomingTrainings) {
      for (const participant of training.participants) {
        const participantId = participant.participant.toString();
        if (!trainingsByParticipant.has(participantId)) {
          trainingsByParticipant.set(participantId, {
            participant: participant.participant,
            trainings: []
          });
        }
        trainingsByParticipant.get(participantId).trainings.push(training);
      }
    }

    for (const { participant, trainings } of trainingsByParticipant.values()) {
      const hasReceived = await this.notificationService.hasReceivedTypeToday(
        participant,
        NotificationEnum.TODAY_TRAININGS_REMINDER
      );
      if (!hasReceived) {
        for (const training of trainings) {
          await this.notificationService.create({
            user: participant,
            triggeredBy: training.creator,
            type: NotificationEnum.TODAY_TRAININGS_REMINDER,
            data: {
              trainingId: training._id.toString(),
              trainingTitle: training.title
            }
          });
        }
      }
    }

    return upcomingTrainings.length;
  }
}
