import { TrainingModel } from "../models/index.js";
import { NotificationEnum, TrainingStatusEnum } from "../types/enums.js";
import { NotificationService } from "./notification.service.js";

export class CronJobService {
  private readonly notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  async createNotificationTrainingCompletionReminder(offsetMinutes = 15) {
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
      await this.notificationService.create({
        user: training.creator,
        type: NotificationEnum.TRAINING_COMPLETION_REMINDER,
        data: {
          trainingId: training._id.toString(),
          trainingTitle: training.title
        }
      });
    }

    return expiredTrainings.length;
  }

  async createNotificationTodayTrainingsReminder() {
    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const tomorrow = new Date(startOfDay);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTrainings = await TrainingModel.find({
      status: TrainingStatusEnum.SCHEDULED,
      date: { $gte: startOfDay, $lt: tomorrow }
    });

    for (const training of todayTrainings) {
      await this.notificationService.create({
        user: training.creator,
        type: NotificationEnum.TODAY_TRAININGS_REMINDER,
        data: {
          trainingId: training._id.toString(),
          trainingTitle: training.title
        }
      });
    }

    return todayTrainings.length;
  }
}
