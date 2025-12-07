import { Request, Response } from "express";
import { AuthResult } from "express-oauth2-jwt-bearer";
import { Document, FilterQuery, SortOrder } from "mongoose";
import { BaseResponse, PaginatedResponse } from "../models/index.js";
import { BaseService } from "../services/index.js";
import { handleError } from "../utils/index.js";

export abstract class BaseController<
  T extends Document,
  S extends BaseService<T>
> {
  protected readonly service: S;
  protected readonly auth?: AuthResult;
  constructor(service: S, auth?: AuthResult) {
    this.service = service;
    this.auth = auth;
  }

  async getAuthUser(populate?: string | string[]) {
    return await this.service.getAuthUser(populate);
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const populateFields = req.query.populate as string | string[];

      const result = await this.service.get({
        id,
        populateFields
      });
      if (!result) {
        res.status(404).json({ message: "Not Found" });
        return;
      }
      res.json(new BaseResponse(result));
    } catch (error) {
      handleError(res, req, error);
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

      res.json(new PaginatedResponse(result));
    } catch (error) {
      handleError(res, req, error);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json(new BaseResponse(result));
    } catch (error) {
      handleError(res, req, error);
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
      res.json(new BaseResponse(result));
    } catch (error) {
      handleError(res, req, error);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.service.delete(id);
      res.status(204).json(new BaseResponse(result));
    } catch (error) {
      handleError(res, req, error);
    }
  }
}
