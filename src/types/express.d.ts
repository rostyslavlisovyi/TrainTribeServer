import type { AwilixContainer } from "awilix";
import type { AuthResult } from "express-oauth2-jwt-bearer";

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
