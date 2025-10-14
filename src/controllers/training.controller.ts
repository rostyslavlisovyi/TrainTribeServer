/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import { AuthResult } from "express-oauth2-jwt-bearer";
import { ITraining, IUser } from "../interfaces/index.js";
import { BaseResponse } from "../models/index.js";
import { NotificationService, TrainingService } from "../services/index.js";
import { NotificationEnum, TrainingStatusEnum } from "../types/index.js";
import { handleError } from "../utils/handleError.js";
import { completeName } from "../utils/user.js";
import { BaseController } from "./base.controller.js";

export class TrainingController extends BaseController<
  ITraining,
  TrainingService
> {
  private readonly notificationService: NotificationService;
  constructor(
    trainingService: TrainingService,
    notificationService: NotificationService,
    auth?: AuthResult
  ) {
    super(trainingService, auth);
    this.notificationService = notificationService;
  }

  override async create(req: Request, res: Response): Promise<void> {
    try {
      const training = await this.service.create(req.body);

      const recommendedUsers =
        await this.service.getPotentialParticipants(training);

      await Promise.all(
        recommendedUsers.map((user) =>
          this.notificationService.create({
            user: user._id,
            triggeredBy: training.creator,
            type: NotificationEnum.TRAINING_CREATED_NEAR_TO_USER,
            data: {
              trainingId: training._id.toString(),
              trainingTitle: training.title
            }
          })
        )
      );

      res.status(201).json(new BaseResponse(training));
    } catch (error) {
      handleError(res, error);
    }
  }

  override async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const populateFields = req.query.populate as string | string[];
      const result = await this.service.update({
        id,
        entity: req.body,
        populateFields
      });

      const participants = result?.participants || [];

      await Promise.all(
        participants.map((participant) =>
          this.notificationService.create({
            user: participant.participant,
            triggeredBy: result?.creator,
            type: NotificationEnum.TRAINING_EDITED,
            data: {
              trainingTitle: result!.title,
              trainingId: result!._id.toString()
            }
          })
        )
      );

      res.json(new BaseResponse(result));
    } catch (error) {
      handleError(res, error);
    }
  }

  override async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const training = await this.service.get({ id });
      const result = await this.service.delete(id);

      const participants = training?.participants || [];

      await Promise.all(
        participants.map((participant) =>
          this.notificationService.create({
            user: participant.participant,
            triggeredBy: training?.creator,
            type: NotificationEnum.TRANING_DELETED,
            data: { trainingTitle: training!.title }
          })
        )
      );

      res.status(204).json(new BaseResponse(result));
    } catch (error) {
      handleError(res, error);
    }
  }

  async getRecommendedTrainings(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.getAuthUser(["city"]);
      const populateFields = req.query.populate as string | string[];
      const result = await this.service.getRecommendedTrainings(
        user,
        populateFields
      );
      res.status(201).json(new BaseResponse(result));
    } catch (error) {
      handleError(res, error);
    }
  }

  async addLike(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.getAuthUser();
      const data = await this.service.addLike(id, user._id.toString());
      res.status(200).json(new BaseResponse(data));
    } catch (error) {
      handleError(res, error);
    }
  }

  async removeLike(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.getAuthUser();
      const data = await this.service.removeLike(id, user._id.toString());
      res.status(200).json(new BaseResponse(data));
    } catch (error) {
      handleError(res, error);
    }
  }

  async addParticipant(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.getAuthUser();

      const data = await this.service.addParticipant(id, user._id.toString());

      await this.notificationService.create({
        user: data?.creator,
        triggeredBy: user._id,
        type: NotificationEnum.USER_JOIN_TRAINING,
        data: {
          userId: user._id.toString(),
          user: completeName(user),
          trainingId: data._id.toString(),
          trainingTitle: data.title
        },
        read: false
      });

      res.status(200).json(new BaseResponse(data));
    } catch (error) {
      handleError(res, error);
    }
  }

  async removeParticipant(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.getAuthUser();
      const data = await this.service.removeParticipant(
        id,
        user._id.toString()
      );
      res.status(200).json(new BaseResponse(data));
    } catch (error) {
      handleError(res, error);
    }
  }

  async addComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { text } = req.body;
      const user = await this.getAuthUser();
      const data = await this.service.addComment(id, user._id.toString(), text);
      if (user._id?.toString() !== data?.creator?.toString()) {
        await this.notificationService.create({
          user: data?.creator,
          triggeredBy: user._id,
          type: NotificationEnum.NEW_COMMENT_ON_TRAINING,
          data: {
            trainingId: data!._id.toString(),
            trainingTitle: data!.title,
            comment: text,
            user: completeName(user)
          }
        });
      }

      res.status(200).json(new BaseResponse(data));
    } catch (error) {
      handleError(res, error);
    }
  }

  async updateComment(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const { text } = req.body;
      const data = await this.service.updateComment(commentId, text);
      res.status(200).json(new BaseResponse(data));
    } catch (error) {
      handleError(res, error);
    }
  }

  async removeComment(req: Request, res: Response) {
    try {
      const { id, commentId } = req.params;
      const data = await this.service.removeComment(id, commentId);
      res.status(200).json(new BaseResponse(data));
    } catch (error) {
      handleError(res, error);
    }
  }

  async changeStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const user = await this.getAuthUser();

      const data = await this.service.changeStatus(
        id,
        user._id.toString(),
        status as TrainingStatusEnum
      );

      if (status === TrainingStatusEnum.COMPLETED) {
        const training = await this.service.get({
          id,
          populateFields: ["creator"]
        });
        const creator = training!.creator as unknown as IUser;

        const participants =
          training?.participants?.filter((x) => x.attended) ?? [];

        await Promise.all(
          participants.map((participant) =>
            this.notificationService.create({
              user: participant.participant,
              triggeredBy: creator._id,
              type: NotificationEnum.REMEMBER_TO_LEAVE_REVIEW,
              data: {
                trainingTitle: data!.title,
                trainingCreator: completeName(creator),
                trainingId: data!._id.toString()
              }
            })
          )
        );
      }

      res.status(200).json(new BaseResponse(data));
    } catch (error) {
      handleError(res, error);
    }
  }
}
