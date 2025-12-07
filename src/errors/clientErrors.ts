import { BaseError } from "./baseError.js";

export class NotFoundError extends BaseError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, true);
  }
}

export class BadRequestError extends BaseError {
  constructor(message = "Invalid request", details?: Record<string, unknown>) {
    super(message, 400, true, details);
  }
}

export class DataCannotBeEmpty extends BaseError {
  constructor(field: string) {
    super(`${field} cannot be empty`, 400, true);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized") {
    super(message, 401, true);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = "Forbidden") {
    super(message, 403, true);
  }
}

export class ConflictError extends BaseError {
  constructor(message = "Conflict") {
    super(message, 409, true);
  }
}
