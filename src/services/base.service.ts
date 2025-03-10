import { Model, Document, FilterQuery } from "mongoose";
import { NotFoundError, DataCannotBeEmpty } from "../errors/index.js";
import chalk from "chalk";

export abstract class BaseService<T extends Document> {
  model: Model<T>;

  protected constructor(model: Model<T>) {
    this.model = model;
  }

  async get({
    id,
    populateFields
  }: {
    id: string;
    populateFields?: string | string[];
  }): Promise<{ data: T | null }> {
    try {
      let query = this.model.findById(id);
      if (populateFields) {
        query = query.populate(populateFields);
      }
      const result = await query;
      return { data: result };
    } catch (error) {
      console.error(chalk.red("Error in get method:"), error);
      throw error;
    }
  }

  async getAll({
    pageNum = 1,
    pageSize = 10,
    populateFields,
    filters = {}
  }: {
    pageNum?: number;
    pageSize?: number;
    populateFields?: string | string[];
    filters?: FilterQuery<T>;
  }): Promise<{
    data: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    try {
      const validPageNum = Math.max(1, pageNum);
      const validPageSize = Math.max(1, pageSize);
      const skips = validPageSize * (validPageNum - 1);

      const totalItems = await this.model.countDocuments(filters);
      const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

      let query = this.model.find(filters).skip(skips).limit(pageSize);
      if (populateFields) {
        query = query.populate(populateFields);
      }

      const data = await query;

      return {
        data,
        totalItems,
        totalPages,
        currentPage: validPageNum,
        hasNextPage: validPageNum < totalPages,
        hasPreviousPage: validPageNum > 1
      };
    } catch (error) {
      console.error(chalk.red("Error in getAll:"), chalk.red(error));
      throw error;
    }
  }

  async create(entity: Partial<T>): Promise<{ data: T }> {
    try {
      if (!entity || Object.keys(entity).length === 0) {
        throw new DataCannotBeEmpty("Entity data cannot be empty");
      }

      const newEntity = await this.model.create(entity);

      return { data: newEntity };
    } catch (error) {
      console.error(chalk.red("Error in create:"), error);
      throw error;
    }
  }

  async update({
    id,
    entity,
    populateFields
  }: {
    id: string;
    entity: Partial<T>;
    populateFields?: string | string[];
  }): Promise<{ data: T | null }> {
    try {
      if (!entity || Object.keys(entity).length === 0) {
        throw new DataCannotBeEmpty("Update data cannot be empty");
      }
      let query = this.model.findByIdAndUpdate(id, entity, {
        new: true
      });
      if (populateFields) {
        query = query.populate(populateFields);
      }
      const updatedData = await query;
      if (!updatedData) {
        throw new NotFoundError(`Data with id ${id} not found`);
      }
      return { data: updatedData };
    } catch (error) {
      console.error(chalk.red("Error in update:"), error);
      throw error;
    }
  }

  async delete(id: string): Promise<{ data: boolean }> {
    try {
      const deleted = await this.model.findByIdAndDelete(id);

      if (!deleted) {
        throw new NotFoundError(`Data with id ${id} not found`);
      }

      return { data: !!deleted };
    } catch (error) {
      console.error(chalk.red("Error in delete:"), error);
      throw error;
    }
  }
}
