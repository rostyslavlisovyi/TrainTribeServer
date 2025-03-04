import { Model, Document, FilterQuery } from "mongoose";

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
    let query = this.model.findById(id);
    if (populateFields) {
      query = query.populate(populateFields);
    }
    return { data: await query };
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
    const skips = pageSize * (pageNum - 1);

    const totalItems = await this.model.countDocuments(filters);
    const totalPages = Math.ceil(totalItems / pageSize);

    let query = this.model.find(filters).skip(skips).limit(pageSize);
    if (populateFields) {
      query = query.populate(populateFields);
    }

    const data = await query;

    return {
      data,
      totalItems,
      totalPages,
      currentPage: pageNum,
      hasNextPage: pageNum < totalPages,
      hasPreviousPage: pageNum > 1
    };
  }

  async create(entity: Partial<T>): Promise<T> {
    return await this.model.create(entity);
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
    let query = this.model.findByIdAndUpdate(id, entity, {
      new: true
    });
    if (populateFields) {
      query = query.populate(populateFields);
    }
    return { data: await query };
  }

  async delete(id: string): Promise<{ data: boolean }> {
    const deleted = await this.model.findByIdAndDelete(id);
    return { data: !!deleted };
  }
}
