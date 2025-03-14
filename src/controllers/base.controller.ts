import { Request, Response } from "express";
import { Document, FilterQuery } from "mongoose";
import { BaseService } from "../services/index.js";
import { handleError } from "../errors/index.js";

export abstract class BaseController<T extends Document> {
  protected service: BaseService<T>;

  constructor(service: BaseService<T>) {
    this.service = service;
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

  async getAll(req: Request, res: Response): Promise<void> {
    try {

      const { pageNum, pageSize, populate, ...filters } = req.body;

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

      const result = await this.service.getAll({
        pageNum: parsedPageNum,
        pageSize: parsedPageSize,
        populateFields: populate as string | string[],
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
