import chalk from "chalk";
import { AuthResult } from "express-oauth2-jwt-bearer";
import {
  Document,
  FilterQuery,
  Model,
  PopulateOptions,
  SortOrder,
  UpdateQuery
} from "mongoose";
import { DataCannotBeEmpty, NotFoundError } from "../errors/index.js";
import { IUser } from "../interfaces/user.interface.js";
import { UserModel } from "../models/index.js";

interface PopulateTree {
  [key: string]: PopulateTree;
}

export abstract class BaseService<T extends Document> {
  protected readonly model: Model<T>;
  protected readonly auth?: AuthResult;

  protected constructor(model: Model<T>, auth?: AuthResult) {
    this.model = model;
    this.auth = auth;
  }

  protected async baseFilter() {
    return {};
  }

  async getAuthUser(populate?: string | string[]): Promise<IUser> {
    if (!this.auth) {
      throw new Error("user not authenticated");
    }
    const query = UserModel.findOne({
      authId: this.auth.payload.user_id
    });

    if (populate) {
      query.populate(populate);
    }
    return (await query) as unknown as IUser;
  }

  async get({
    id,
    populateFields
  }: {
    id: string;
    populateFields?: string | string[];
  }): Promise<T | null> {
    try {
      let query = this.model.findOne({ _id: id, ...(await this.baseFilter()) });
      if (populateFields) {
        query = query.populate(this.buildPopulate(populateFields));
      }
      return await query;
    } catch (error) {
      console.error(chalk.red("Error in get method:"), error);
      throw error;
    }
  }
  async list({
    pageNum = 1,
    pageSize = 10,
    populateFields,
    sort,
    filters = {}
  }: {
    pageNum?: number;
    pageSize?: number;
    populateFields?: string | string[];
    sort?: Record<string, SortOrder>;
    filters?: FilterQuery<T>;
  }): Promise<{
    data: T[];
    totalItems: number;
    pageSize: number;
    currentPage: number;
  }> {
    try {
      const validPageNum = Math.max(1, pageNum);
      const validPageSize = Math.max(1, pageSize);
      const skips = validPageSize * (validPageNum - 1);

      const combinedFilters = {
        ...(filters ?? {}),
        ...(await this.baseFilter())
      };

      const totalItems = await this.model.countDocuments(combinedFilters);

      let query = this.model.find(combinedFilters);
      if (sort) {
        query = query.sort(sort);
      }
      query = query.skip(skips).limit(validPageSize);

      if (populateFields) {
        query = query.populate(this.buildPopulate(populateFields));
      }

      const data = await query.exec();

      return {
        data,
        totalItems,
        pageSize: validPageSize,
        currentPage: validPageNum
      };
    } catch (error) {
      console.error(chalk.red("Error in list:"), chalk.red(error));
      throw error;
    }
  }

  async create(entity: Partial<T>): Promise<T> {
    try {
      if (!entity || Object.keys(entity).length === 0) {
        throw new DataCannotBeEmpty("Entity data cannot be empty");
      }

      const newEntity = await this.model.create(entity);

      return newEntity;
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
    entity: UpdateQuery<T>;
    populateFields?: string | string[];
  }): Promise<T | null> {
    try {
      if (!entity || Object.keys(entity).length === 0) {
        throw new DataCannotBeEmpty("Update data cannot be empty");
      }
      let query = this.model.findByIdAndUpdate(id, entity, {
        new: true
      });
      if (populateFields) {
        query = query.populate(this.buildPopulate(populateFields));
      }
      const updatedData = await query;
      if (!updatedData) {
        throw new NotFoundError(`Data with id ${id} not found`);
      }
      return updatedData;
    } catch (error) {
      console.error(chalk.red("Error in update:"), error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deleted = await this.model.findByIdAndDelete(id);

      if (!deleted) {
        throw new NotFoundError(`Data with id ${id} not found`);
      }

      return !!deleted;
    } catch (error) {
      console.error(chalk.red("Error in delete:"), error);
      throw error;
    }
  }

  private buildPopulate(
    paths: string | string[]
  ): PopulateOptions | PopulateOptions[] {
    const tree: Record<string, PopulateTree> = {};

    const pathArray = Array.isArray(paths) ? paths : [paths];

    for (const path of pathArray) {
      const parts = path.split(".");
      let current = tree;

      for (const part of parts) {
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    }

    function convert(node: Record<string, PopulateTree>): PopulateOptions[] {
      return Object.entries(node).map(([key, value]) => {
        const populate = convert(value);
        const result: PopulateOptions = { path: key };
        if (populate.length > 0) {
          result.populate = populate.length === 1 ? populate[0] : populate;
        }
        return result;
      });
    }
    const result = convert(tree);
    return result.length === 1 ? result[0] : result;
  }
}
