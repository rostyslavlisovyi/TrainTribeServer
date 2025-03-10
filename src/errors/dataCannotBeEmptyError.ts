import { BaseError } from "./baseError.ts";

export class DataCannotBeEmpty extends BaseError {
  constructor(message = "DATA CANNOT BE EMPTY") {
    super(message, 400);
    this.name = "DataCannotBeEmptyError";
  }
}
