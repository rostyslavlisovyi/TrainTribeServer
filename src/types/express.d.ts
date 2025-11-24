import type { AwilixContainer } from "awilix";
import type { AuthResult } from "express-oauth2-jwt-bearer";
import type { Request } from "express";

declare module "express" {
  export interface Request {
    validatedId?: string;
    auth?: AuthResult;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    container: AwilixContainer;
  }
}
