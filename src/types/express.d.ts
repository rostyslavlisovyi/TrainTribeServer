import type { AuthResult } from "express-oauth2-jwt-bearer";
import type { RequestContext } from "../context/requestContext.js";

declare module "express" {
  export interface Request {
    validatedId?: string;
    auth?: AuthResult;
    context?: RequestContext;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    validatedId?: string;
    auth?: AuthResult;
    context?: RequestContext;
  }
}
