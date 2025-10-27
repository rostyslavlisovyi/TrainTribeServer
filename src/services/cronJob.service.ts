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

    for (const training of expiredTrainings) {
      const hasReceived = await this.notificationService.hasReceivedTypeToday(
        training.creator,
        NotificationEnum.TRAINING_COMPLETION_REMINDER
      );
      if (!hasReceived) {
        await this.notificationService.create({
          user: training.creator,
          triggeredBy: training.creator,
          type: NotificationEnum.TRAINING_COMPLETION_REMINDER,
          data: {
            trainingId: training._id.toString(),
            trainingTitle: training.title
          }
        });
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

    for (const training of upcomingTrainings) {
      const creatorHasReceived =
        await this.notificationService.hasReceivedTypeToday(
          training.creator,
          NotificationEnum.TODAY_TRAININGS_REMINDER
        );
      if (!creatorHasReceived) {
        await this.notificationService.create({
          user: training.creator,
          triggeredBy: training.creator,
          type: NotificationEnum.TODAY_TRAININGS_REMINDER,
          data: {
            trainingId: training._id.toString(),
            trainingTitle: training.title
          }
        });
      }

      await Promise.all(
        training.participants.map(async (participant) => {
          const participantHasReceived =
            await this.notificationService.hasReceivedTypeToday(
              participant.participant,
              NotificationEnum.TODAY_TRAININGS_REMINDER
            );
          if (!participantHasReceived) {
            await this.notificationService.create({
              user: participant.participant,
              triggeredBy: training.creator,
              type: NotificationEnum.TODAY_TRAININGS_REMINDER,
              data: {
                trainingId: training._id.toString(),
                trainingTitle: training.title
              }
            });
          }
        })
      );
    }

    return upcomingTrainings.length;
  }
}
