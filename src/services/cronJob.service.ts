import { INotification } from "../interfaces/index.js";
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

    const notificationPromises: Promise<INotification | undefined>[] = [];

    for (const training of expiredTrainings) {
      notificationPromises.push(
        (async () => {
          const hasReceived =
            await this.notificationService.hasReceivedTrainingTypeToday(
              training.creator,
              training._id,
              NotificationEnum.TRAINING_COMPLETION_REMINDER
            );
          if (!hasReceived) {
            return this.notificationService.create({
              user: training.creator,
              triggeredBy: training.creator,
              type: NotificationEnum.TRAINING_COMPLETION_REMINDER,
              data: {
                trainingId: training._id,
                trainingTitle: training.title
              }
            });
          }
          return undefined;
        })()
      );
    }

    await Promise.all(notificationPromises).then((results) =>
      results.filter((r) => r !== undefined)
    );

    return expiredTrainings.length;
  }

  async createNotificationTodayTrainingsReminder() {
    const now = new Date();

    const fiveHoursFromNow = new Date(now.getTime() + 5 * 60 * 60 * 1000);

    const upcomingTrainings = await TrainingModel.find({
      status: TrainingStatusEnum.SCHEDULED,
      date: { $gt: now, $lte: fiveHoursFromNow }
    });

    const notificationPromises: Promise<INotification | undefined>[] = [];

    for (const training of upcomingTrainings) {
      // For creators
      notificationPromises.push(
        (async () => {
          const hasReceived =
            await this.notificationService.hasReceivedTrainingTypeToday(
              training.creator,
              training._id,
              NotificationEnum.TODAY_TRAININGS_REMINDER
            );
          if (!hasReceived) {
            return this.notificationService.create({
              user: training.creator,
              triggeredBy: training.creator,
              type: NotificationEnum.TODAY_TRAININGS_REMINDER,
              data: {
                trainingId: training._id,
                trainingTitle: training.title
              }
            });
          }
          return undefined;
        })()
      );

      // For participants
      for (const participant of training.participants) {
        notificationPromises.push(
          (async () => {
            const hasReceived =
              await this.notificationService.hasReceivedTrainingTypeToday(
                participant.participant,
                training._id,
                NotificationEnum.TODAY_TRAININGS_REMINDER
              );
            if (!hasReceived) {
              return this.notificationService.create({
                user: participant.participant,
                triggeredBy: training.creator,
                type: NotificationEnum.TODAY_TRAININGS_REMINDER,
                data: {
                  trainingId: training._id,
                  trainingTitle: training.title
                }
              });
            }
            return undefined;
          })()
        );
      }
    }

    await Promise.all(notificationPromises).then((results) =>
      results.filter((r: INotification | undefined) => r !== undefined)
    );

    return upcomingTrainings.length;
  }

  async createNotificationRememberToCreateTraining() {
    const now = new Date();
    const romeNow = new Date(
      now.toLocaleString("en-US", { timeZone: "Europe/Rome" })
    );

    // send only on sunday
    if (romeNow.getDay() !== 0) {
      return 0;
    }

    // send only at 16:00
    if (romeNow.getHours() !== 16) {
      return 0;
    }

    const nextMonday = new Date(romeNow);
    nextMonday.setDate(nextMonday.getDate() + 1);
    nextMonday.setHours(0, 0, 0, 0);

    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextSunday.getDate() + 6);
    nextSunday.setHours(23, 59, 59, 999);

    const nextMondayUTC = new Date(
      nextMonday.toLocaleString("en-US", { timeZone: "UTC" })
    );
    const nextSundayUTC = new Date(
      nextSunday.toLocaleString("en-US", { timeZone: "UTC" })
    );

    const { UserModel } = await import("../models/index.js");
    const users = await UserModel.find();

    const notificationPromises: Promise<INotification | undefined>[] = [];

    for (const user of users) {
      notificationPromises.push(
        (async () => {
          const hasReceived =
            await this.notificationService.hasReceivedNotificationTypeToday(
              user._id,
              NotificationEnum.REMEMBER_TO_CREATE_TRAINING
            );

          if (!hasReceived) {
            const trainingNextWeek = await TrainingModel.findOne({
              creator: user._id,
              status: TrainingStatusEnum.SCHEDULED,
              date: { $gte: nextMondayUTC, $lte: nextSundayUTC }
            });

            if (!trainingNextWeek) {
              return this.notificationService.create({
                user: user._id,
                triggeredBy: user._id,
                type: NotificationEnum.REMEMBER_TO_CREATE_TRAINING,
                data: {}
              });
            }
          }
          return undefined;
        })()
      );
    }

    await Promise.all(notificationPromises).then((results) =>
      results.filter((r: INotification | undefined) => r !== undefined)
    );

    return users.length;
  }
}
