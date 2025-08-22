import { Request, Response } from "express";
import { Document, FilterQuery, SortOrder } from "mongoose";
import container from "../container.js";
import { IUser } from "../interfaces/user.interface.js";
import { BaseService } from "../services/index.js";
import { UserService } from "../services/user.service.js";
import { handleError } from "../utils/index.js";

export abstract class BaseController<
  T extends Document,
  S extends BaseService<T>
> {
  protected service: S;
  protected userService: UserService;

  constructor(service: S) {
    this.service = service;
    this.userService = container.resolve<UserService>("userService");
  }

  protected async getUserFromToken(req: Request): Promise<IUser> {
    const token = req.auth;
    const { populate } = req.query;

    if (!token) {
      throw new Error("No token provided");
    }
    const query = this.userService.model.findOne({
      auth_id: token.payload.user_id
    });
    if (populate) {
      query.populate(populate as string | string[]);
    }
    const user = (await query) as unknown as IUser;
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const populateFields = req.query.populate as string | string[];

      const result = await this.service.get({
        id,
        populateFields
      });
      if (!result.data) {
        res.status(404).json({ message: "Not Found" });
        return;
      }
      res.json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const { pageNum, pageSize, sort, populate, filters } = req.body;

      const parsedPageNum = parseInt((pageNum as string) || "1", 10);
      const parsedPageSize = parseInt((pageSize as string) || "10", 10);

      if (isNaN(parsedPageNum) || parsedPageNum < 1) {
        res
          .status(400)
          .json({ message: "Invalid pageNum. Must be a positive number." });
        return;
      }

      if (isNaN(parsedPageSize) || parsedPageSize < 1) {
        res
          .status(400)
          .json({ message: "Invalid pageSize. Must be a positive number." });
        return;
      }

      const result = await this.service.list({
        pageNum: parsedPageNum,
        pageSize: parsedPageSize,
        populateFields: populate as string | string[],
        sort: sort as unknown as Record<string, SortOrder>,
        filters: filters as unknown as FilterQuery<T>
      });

      res.json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const populateFields = req.query.populate as string | string[];
      const result = await this.service.update({
        id,
        entity: req.body,
        populateFields
      });
      res.json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  }
}
