import { Request, Response } from "express";
import { Document, FilterQuery } from "mongoose";
import { BaseService } from "../services/index.js";
import { handleError } from "../utils/index.js";

export abstract class BaseController<T extends Document> {
  protected service: BaseService<T>;

  constructor(service: BaseService<T>) {
    this.service = service;
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { populate } = req.query;
      const result = await this.service.get({
        id,
        populateFields: populate as string | string[]
      });
      if (!result) {
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
      const { pageNum = "1", pageSize = "10", populate, ...filters } = req.body;
      const result = await this.service.getAll({
        pageNum: parseInt(pageNum as string, 10),
        pageSize: parseInt(pageSize as string, 10),
        populateFields: populate as string | string[],
        filters: filters as FilterQuery<T>
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
      const { populate } = req.query;
      const result = await this.service.update({
        id,
        entity: req.body,
        populateFields: populate as string | string[]
      });
      if (!result) {
        res.status(404).json({ message: "Not Found" });
        return;
      }
      res.json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.service.delete(id);
      if (!deleted) {
        res.status(404).json({ message: "Not Found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  }
}
