import { AwilixContainer } from "awilix";
import "express";

declare module "express" {
  export interface Request {
    validatedId?: string;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    container: AwilixContainer;
  }
}
